"use client";

import { CheckCircle2, Download, PackageCheck, RefreshCcw, Truck } from "lucide-react";
import type { ToolResult } from "@/lib/tools";

type ToolCardProps = {
  result: ToolResult;
};

export function ToolCard({ result }: ToolCardProps) {
  if (result.type === "order") {
    return <TrackingCard result={result} />;
  }

  if (result.type === "return") {
    return <ReturnCard result={result} />;
  }

  if (result.type === "exchange") {
    return <ExchangeCard result={result} />;
  }

  return <ReplacementCard result={result} />;
}

function TrackingCard({ result }: { result: Extract<ToolResult, { type: "order" }> }) {
  const { order, relatedTickets } = result;

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950">
        <Truck className="h-4 w-4" />
        Tracking for {order.order_id}
      </div>
      <div className="space-y-2 text-sm">
        <Row label="Customer" value={order.customer_name} />
        <Row label="Status" value={order.shipping_status} />
        <Row label="Carrier" value={order.carrier ?? "Pending"} />
        <Row label="Tracking" value={order.tracking_number ?? "Not assigned yet"} />
        <Row label="Estimated delivery" value={formatDate(order.delivery_estimate)} />
        <Row label="Payment" value={order.payment_status} />
      </div>
      <div className="mt-3 space-y-2">
        {order.items.map((item) => (
          <div key={`${item.product}-${item.size}-${item.color}`} className="rounded-xl bg-zinc-50 p-3 text-sm">
            <p className="font-medium text-zinc-950">{item.product}</p>
            <p className="text-zinc-500">
              {item.color} / Size {item.size} / Qty {item.qty}
            </p>
          </div>
        ))}
      </div>
      {relatedTickets.length ? (
        <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
          Existing ticket: {relatedTickets[0].ticket_id} ({relatedTickets[0].issue_type}, {relatedTickets[0].status})
        </div>
      ) : null}
    </article>
  );
}

function ReturnCard({ result }: { result: Extract<ToolResult, { type: "return" }> }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950">
        <PackageCheck className="h-4 w-4" />
        Return started
      </div>
      <p className="text-sm text-zinc-700">{result.message}</p>
      <div className="my-3 rounded-xl bg-zinc-950 p-3 text-sm text-white">
        <p className="font-medium">{result.item.product}</p>
        <p>Refund estimate: ${result.refundAmount.toFixed(2)}</p>
        <p>{result.refundEstimate}</p>
      </div>
      <a
        href={result.labelUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        <Download className="h-4 w-4" />
        Download fake label
      </a>
    </article>
  );
}

function ExchangeCard({ result }: { result: Extract<ToolResult, { type: "exchange" }> }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950">
        <RefreshCcw className="h-4 w-4" />
        Exchange confirmed
      </div>
      <p className="text-sm text-zinc-700">{result.message}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-zinc-50 p-3">
          <p className="text-zinc-500">Original</p>
          <p className="font-semibold">
            {result.oldColor} / {result.oldSize}
          </p>
        </div>
        <div className="rounded-xl bg-pink-50 p-3">
          <p className="text-pink-700">New</p>
          <p className="font-semibold text-pink-950">
            {result.newSize}
            {result.newColor ? ` / ${result.newColor}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}

function ReplacementCard({ result }: { result: Extract<ToolResult, { type: "replacement" }> }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950">
        <CheckCircle2 className="h-4 w-4" />
        Replacement approved
      </div>
      <p className="text-sm text-zinc-700">{result.message}</p>
      <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm">
        <p className="text-emerald-700">Confirmation</p>
        <p className="font-semibold text-emerald-950">{result.confirmationNumber}</p>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-zinc-500">{label}</span>
      <span className="text-right font-medium text-zinc-950">{value}</span>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
