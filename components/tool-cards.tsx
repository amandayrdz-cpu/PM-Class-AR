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
  const { order } = result;

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Truck className="h-4 w-4 text-blue-600" />
        Tracking for {order.orderNumber}
      </div>
      <div className="space-y-2 text-sm">
        <Row label="Status" value={statusLabel(order.status)} />
        <Row label="Carrier" value={order.shipment.carrier} />
        <Row label="Tracking" value={order.shipment.trackingNumber} />
        {order.shipment.estimatedDelivery ? (
          <Row label="Estimated delivery" value={formatDate(order.shipment.estimatedDelivery)} />
        ) : null}
        {order.shipment.deliveredAt ? <Row label="Delivered" value={formatDate(order.shipment.deliveredAt)} /> : null}
        <p className="rounded-xl bg-slate-50 p-3 text-slate-700">{order.shipment.lastEvent}</p>
      </div>
      <div className="mt-3 space-y-2">
        {order.items.map((item) => (
          <div key={item.sku} className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium text-slate-900">{item.name}</p>
              <p className="text-slate-500">
                {item.sku} - Size {item.size}
              </p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function ReturnCard({ result }: { result: Extract<ToolResult, { type: "return" }> }) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <PackageCheck className="h-4 w-4 text-emerald-600" />
        Return started
      </div>
      <p className="text-sm text-slate-700">{result.message}</p>
      <div className="my-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-950">
        <p className="font-medium">{result.item.name}</p>
        <p>Refund: ${result.item.price.toFixed(2)}</p>
        <p>{result.refundEstimate}</p>
      </div>
      <a
        href={result.labelUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        <Download className="h-4 w-4" />
        Download fake label
      </a>
    </article>
  );
}

function ExchangeCard({ result }: { result: Extract<ToolResult, { type: "exchange" }> }) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <RefreshCcw className="h-4 w-4 text-violet-600" />
        Size exchange confirmed
      </div>
      <p className="text-sm text-slate-700">{result.message}</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Original size</p>
          <p className="font-semibold">{result.oldSize}</p>
        </div>
        <div className="rounded-xl bg-violet-50 p-3">
          <p className="text-violet-700">New size</p>
          <p className="font-semibold text-violet-950">{result.newSize}</p>
        </div>
      </div>
    </article>
  );
}

function ReplacementCard({ result }: { result: Extract<ToolResult, { type: "replacement" }> }) {
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        Replacement approved
      </div>
      <p className="text-sm text-slate-700">{result.message}</p>
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
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-900">{value}</span>
    </div>
  );
}

function statusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}
