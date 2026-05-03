import Anthropic from "@anthropic-ai/sdk";
import type { ContentBlock, MessageParam, Tool, ToolUseBlock } from "@anthropic-ai/sdk/resources/messages";
import { NextResponse } from "next/server";
import { systemPrompt } from "@/lib/system-prompt";
import {
  approveReplacement,
  lookupOrder,
  startExchange,
  startReturn,
  ToolError,
  type ToolResult,
} from "@/lib/tools";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  hiddenContext?: string;
};

type ClientToolEvent = {
  toolName: string;
  ok: boolean;
  result?: ToolResult;
  error?: string;
};

const tools: Tool[] = [
  {
    name: "lookupOrder",
    description: "Verify a customer's order number and email, then return order and shipment details.",
    input_schema: {
      type: "object",
      properties: {
        orderNumber: { type: "string", description: "Northwind order number, for example NW-1001." },
        email: { type: "string", description: "Customer email address on the order." },
      },
      required: ["orderNumber", "email"],
    },
  },
  {
    name: "startReturn",
    description: "Start a return for an eligible item after the customer confirms the action.",
    input_schema: {
      type: "object",
      properties: {
        orderNumber: { type: "string" },
        sku: { type: "string" },
        reason: { type: "string" },
      },
      required: ["orderNumber", "sku", "reason"],
    },
  },
  {
    name: "startExchange",
    description: "Reserve a different size for an eligible item after the customer confirms the action.",
    input_schema: {
      type: "object",
      properties: {
        orderNumber: { type: "string" },
        sku: { type: "string" },
        newSize: { type: "string" },
      },
      required: ["orderNumber", "sku", "newSize"],
    },
  },
  {
    name: "approveReplacement",
    description: "Approve a replacement for a damaged or wrong eligible item after the customer confirms.",
    input_schema: {
      type: "object",
      properties: {
        orderNumber: { type: "string" },
        sku: { type: "string" },
        reason: { type: "string" },
      },
      required: ["orderNumber", "sku", "reason"],
    },
  },
];

const encoder = new TextEncoder();

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages?: ChatMessage[] };

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY." }, { status: 500 });
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const conversation = toAnthropicMessages(messages ?? []);

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        let response = await anthropic.messages.create({
          model: "claude-sonnet-4-5-20250929",
          max_tokens: 900,
          system: systemPrompt,
          tools,
          messages: conversation,
        });

        emitText(response.content, send);

        let safetyCounter = 0;
        while (response.stop_reason === "tool_use" && safetyCounter < 6) {
          safetyCounter += 1;
          const toolUses = response.content.filter((block): block is ToolUseBlock => block.type === "tool_use");

          conversation.push({ role: "assistant", content: response.content });
          const toolResults = toolUses.map((toolUse) => runTool(toolUse, send));
          conversation.push({ role: "user", content: toolResults });

          response = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 900,
            system: systemPrompt,
            tools,
            messages: conversation,
          });

          emitText(response.content, send);
        }

        send("done", {});
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Something went wrong while talking to Claude.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
}

function toAnthropicMessages(messages: ChatMessage[]): MessageParam[] {
  return messages
    .filter((message) => message.content.trim() || message.hiddenContext?.trim())
    .map((message) => ({
      role: message.role,
      content: [message.content, message.hiddenContext].filter(Boolean).join("\n\n"),
    }));
}

function emitText(content: ContentBlock[], send: (event: string, data: unknown) => void) {
  const text = content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  if (text.trim()) {
    send("text", { text });
  }
}

function runTool(toolUse: ToolUseBlock, send: (event: string, data: ClientToolEvent) => void) {
  try {
    const input = toolUse.input as Record<string, string>;
    const result = callTool(toolUse.name, input);
    send("tool", { toolName: toolUse.name, ok: true, result });

    return {
      type: "tool_result" as const,
      tool_use_id: toolUse.id,
      content: JSON.stringify(result),
    };
  } catch (error) {
    const message =
      error instanceof ToolError || error instanceof Error
        ? error.message
        : "The training tool could not complete that request.";

    send("tool", { toolName: toolUse.name, ok: false, error: message });

    return {
      type: "tool_result" as const,
      tool_use_id: toolUse.id,
      is_error: true,
      content: message,
    };
  }
}

function callTool(name: string, input: Record<string, string>): ToolResult {
  switch (name) {
    case "lookupOrder":
      return lookupOrder(input.orderNumber, input.email);
    case "startReturn":
      return startReturn(input.orderNumber, input.sku, input.reason);
    case "startExchange":
      return startExchange(input.orderNumber, input.sku, input.newSize);
    case "approveReplacement":
      return approveReplacement(input.orderNumber, input.sku, input.reason);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
