"use client";

import { FocusEvent, FormEvent, useRef, useState } from "react";
import { AlertCircle, Headphones, Loader2, MessageCircle, Send, Sparkles } from "lucide-react";
import { ToolCard } from "@/components/tool-cards";
import type { ToolResult } from "@/lib/tools";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  toolResult?: ToolResult;
  error?: string;
};

type ApiMessage = {
  role: "assistant" | "user";
  content: string;
};

type StreamEvent =
  | { event: "text"; data: { text: string } }
  | { event: "tool"; data: { toolName: string; ok: boolean; result?: ToolResult; error?: string } }
  | { event: "error"; data: { message: string } }
  | { event: "done"; data: Record<string, never> };

const starterPrompts = ["Where is my order ORD-1001?", "I want to return my jeans", "My hoodie arrived damaged"];

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi, I'm SHEIN's support assistant. I can help with tracking, returns, exchanges, and damaged or wrong items. What's your order ID and email?",
  },
];

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const widgetRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function sendMessage(nextContent?: string) {
    const content = (nextContent ?? inputRef.current?.value ?? input).trim();
    if (!content || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = messages
        .map<ApiMessage | null>((message) => {
          if (message.toolResult) {
            return {
              role: "assistant",
              content: `Tool result shown to customer as a card: ${JSON.stringify(message.toolResult)}`,
            };
          }

          if (!message.content.trim()) return null;

          return { role: message.role, content: message.content };
        })
        .filter((message): message is ApiMessage => Boolean(message));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...apiMessages, { role: "user", content }],
        }),
      });

      if (!response.ok) {
        throw new Error("The assistant could not respond. Check the server logs and OpenAI API key.");
      }

      await readEventStream(response, (streamEvent) => {
        if (streamEvent.event === "text") {
          appendAssistantText(streamEvent.data.text);
          return;
        }

        if (streamEvent.event === "tool") {
          if (streamEvent.data.ok && streamEvent.data.result) {
            appendToolCard(streamEvent.data.result);
          } else {
            appendAssistantError(streamEvent.data.error ?? "That tool action could not be completed.");
          }
          return;
        }

        if (streamEvent.event === "error") {
          appendAssistantError(streamEvent.data.message);
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I hit a setup issue. For the class, confirm OPENAI_API_KEY is configured and try again.",
          error: message,
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function appendAssistantText(text: string) {
    setMessages((current) => {
      const last = current.at(-1);
      if (last?.role === "assistant" && !last.toolResult && !last.error) {
        return [
          ...current.slice(0, -1),
          {
            ...last,
            content: `${last.content}${last.content ? "\n\n" : ""}${text}`,
          },
        ];
      }

      return [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: text,
        },
      ];
    });
  }

  function appendToolCard(toolResult: ToolResult) {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        toolResult,
      },
    ]);
  }

  function appendAssistantError(error: string) {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I could not complete that action.",
        error,
      },
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function handleWidgetBlur(event: FocusEvent<HTMLElement>) {
    if (!widgetRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsWidgetOpen(false);
    }
  }

  return (
    <section
      ref={widgetRef}
      className="fixed bottom-5 right-5 z-50 md:bottom-7 md:right-7"
      aria-label="SHEIN support chat"
      onMouseEnter={() => setIsWidgetOpen(true)}
      onMouseLeave={() => setIsWidgetOpen(false)}
      onFocus={() => setIsWidgetOpen(true)}
      onBlur={handleWidgetBlur}
    >
      <button
        type="button"
        className={cn(
          "flex h-[86px] w-[270px] items-center gap-3 rounded-full border border-zinc-200 bg-white p-3 text-left shadow-2xl shadow-black/25 ring-4 ring-white/80 transition duration-300",
          isWidgetOpen ? "translate-y-3 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100",
        )}
        aria-expanded={isWidgetOpen}
        aria-controls="shein-support-chat"
        onClick={() => setIsWidgetOpen((open) => !open)}
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-black text-white">
          <Headphones className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-500">SHEIN support</p>
          <p className="truncate text-sm font-bold text-black">Hover for order help</p>
          <p className="text-xs text-zinc-500">Tracking, returns, exchanges</p>
        </div>
        <Sparkles className="ml-auto h-4 w-4 text-[#ff5f8f]" />
      </button>

      <div
        id="shein-support-chat"
        className={cn(
          "absolute bottom-0 right-0 flex h-[720px] max-h-[calc(100vh-2rem)] min-h-[600px] w-[min(calc(100vw-2rem),440px)] flex-col overflow-hidden rounded-[1.35rem] border border-zinc-200 bg-white shadow-2xl shadow-black/30 transition duration-300",
          isWidgetOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-6 scale-95 opacity-0",
        )}
      >
        <header className="border-b border-zinc-200 bg-gradient-to-r from-black via-zinc-950 to-black p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-black">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-zinc-300">SHEIN</p>
            <h1 className="text-xl font-semibold text-white">Order support</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading ? (
          <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            SHEIN support is checking your order...
          </div>
        ) : null}
      </div>

      <div className="border-t border-zinc-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => void sendMessage(prompt)}
              className="rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-900 transition hover:border-black hover:bg-zinc-100"
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void sendMessage();
              }
            }}
            placeholder="Type your message..."
            rows={2}
            className="min-h-12 flex-1 resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none ring-zinc-200 transition placeholder:text-zinc-400 focus:bg-white focus:ring-4"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="grid h-12 w-12 place-items-center rounded-2xl bg-black text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
      </div>
    </section>
  );
}

async function readEventStream(response: Response, onEvent: (streamEvent: StreamEvent) => void) {
  if (!response.body) {
    throw new Error("The assistant response did not include a stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const streamEvent = parseStreamEvent(chunk);
      if (streamEvent) onEvent(streamEvent);
    }
  }

  if (buffer.trim()) {
    const streamEvent = parseStreamEvent(buffer);
    if (streamEvent) onEvent(streamEvent);
  }
}

function parseStreamEvent(chunk: string): StreamEvent | null {
  const eventLine = chunk.split("\n").find((line) => line.startsWith("event: "));
  const dataLine = chunk.split("\n").find((line) => line.startsWith("data: "));

  if (!eventLine || !dataLine) return null;

  const event = eventLine.replace("event: ", "") as StreamEvent["event"];
  const data = JSON.parse(dataLine.replace("data: ", ""));

  if (event === "text" || event === "tool" || event === "error" || event === "done") {
    return { event, data } as StreamEvent;
  }

  return null;
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.toolResult) {
    return <ToolCard result={message.toolResult} />;
  }

  return (
    <div className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6",
          message.role === "user"
            ? "rounded-br-lg bg-black text-white"
            : "rounded-bl-lg bg-zinc-100 text-zinc-800",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.error ? (
          <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-white/70 p-2 text-xs text-red-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {message.error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
