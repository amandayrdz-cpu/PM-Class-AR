import OpenAI from "openai";
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
};

type ClientToolEvent = {
  toolName: string;
  ok: boolean;
  result?: ToolResult;
  error?: string;
};

type ConversationMessage = OpenAI.Chat.Completions.ChatCompletionMessageParam;
type ToolCall = OpenAI.Chat.Completions.ChatCompletionMessageToolCall;

const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "lookupOrder",
      description: "Verify a SHEIN customer's order ID and email, then return order and shipment details.",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "SHEIN demo order ID, for example ORD-1001." },
          email: { type: "string", description: "Customer email address on the order." },
        },
        required: ["orderId", "email"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "startReturn",
      description: "Start a return for an eligible delivered item after the customer confirms the action.",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string" },
          product: { type: "string" },
          reason: { type: "string" },
        },
        required: ["orderId", "product", "reason"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "startExchange",
      description: "Start a size or color exchange for an eligible item after the customer confirms the action.",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string" },
          product: { type: "string" },
          newSize: { type: "string" },
          newColor: { type: "string" },
        },
        required: ["orderId", "product"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "approveReplacement",
      description: "Approve a replacement for a damaged or wrong delivered item after the customer confirms.",
      parameters: {
        type: "object",
        properties: {
          orderId: { type: "string" },
          product: { type: "string" },
          reason: { type: "string" },
        },
        required: ["orderId", "product", "reason"],
        additionalProperties: false,
      },
    },
  },
];

const encoder = new TextEncoder();

export async function POST(request: Request) {
  const { messages } = (await request.json()) as { messages?: ChatMessage[] };

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const conversation: ConversationMessage[] = [
    { role: "system", content: systemPrompt },
    ...toOpenAIMessages(messages ?? []),
  ];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        let response = await openai.chat.completions.create({
          model,
          messages: conversation,
          tools,
          tool_choice: "auto",
        });

        emitText(response.choices[0]?.message.content, send);

        let safetyCounter = 0;
        while (response.choices[0]?.finish_reason === "tool_calls" && safetyCounter < 6) {
          safetyCounter += 1;
          const assistantMessage = response.choices[0]?.message;
          if (!assistantMessage) break;

          const toolCalls = assistantMessage.tool_calls ?? [];

          conversation.push(assistantMessage);
          for (const toolCall of toolCalls) {
            const toolResult = runTool(toolCall, send);
            conversation.push(toolResult);
          }

          response = await openai.chat.completions.create({
            model,
            messages: conversation,
            tools,
            tool_choice: "auto",
          });

          emitText(response.choices[0]?.message.content, send);
        }

        send("done", {});
      } catch (error) {
        send("error", {
          message: error instanceof Error ? error.message : "Something went wrong while talking to OpenAI.",
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

function toOpenAIMessages(messages: ChatMessage[]): ConversationMessage[] {
  return messages
    .filter((message) => message.content.trim())
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

function emitText(content: string | null | undefined, send: (event: string, data: unknown) => void) {
  if (content?.trim()) {
    send("text", { text: content });
  }
}

function runTool(toolCall: ToolCall, send: (event: string, data: ClientToolEvent) => void): ConversationMessage {
  if (toolCall.type !== "function") {
    return {
      role: "tool",
      tool_call_id: toolCall.id,
      content: "Unsupported tool call type.",
    };
  }

  const toolName = toolCall.function.name;

  try {
    const input = JSON.parse(toolCall.function.arguments || "{}") as Record<string, string | undefined>;
    const result = callTool(toolName, input);
    send("tool", { toolName, ok: true, result });

    return {
      role: "tool",
      tool_call_id: toolCall.id,
      content: JSON.stringify(result),
    };
  } catch (error) {
    const message =
      error instanceof ToolError || error instanceof Error
        ? error.message
        : "The training tool could not complete that request.";

    send("tool", { toolName, ok: false, error: message });

    return {
      role: "tool",
      tool_call_id: toolCall.id,
      content: message,
    };
  }
}

function callTool(name: string, input: Record<string, string | undefined>): ToolResult {
  switch (name) {
    case "lookupOrder":
      return lookupOrder(required(input.orderId, "orderId"), required(input.email, "email"));
    case "startReturn":
      return startReturn(required(input.orderId, "orderId"), required(input.product, "product"), required(input.reason, "reason"));
    case "startExchange":
      return startExchange(required(input.orderId, "orderId"), required(input.product, "product"), input.newSize, input.newColor);
    case "approveReplacement":
      return approveReplacement(required(input.orderId, "orderId"), required(input.product, "product"), required(input.reason, "reason"));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

function required(value: string | undefined, field: string) {
  if (!value?.trim()) {
    throw new Error(`Missing required field: ${field}`);
  }

  return value;
}
