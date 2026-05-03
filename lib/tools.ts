import { orders, type Order, type OrderItem } from "./mock-data";

export type ToolResult =
  | { type: "order"; order: Order }
  | {
      type: "return";
      orderNumber: string;
      item: OrderItem;
      reason: string;
      labelUrl: string;
      refundEstimate: string;
      message: string;
    }
  | {
      type: "exchange";
      orderNumber: string;
      item: OrderItem;
      oldSize: string;
      newSize: string;
      message: string;
    }
  | {
      type: "replacement";
      orderNumber: string;
      item: OrderItem;
      reason: string;
      confirmationNumber: string;
      message: string;
    };

const SUPPORT_EMAIL = "support@northwind.example";

export class ToolError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "ORDER_NOT_FOUND"
      | "ITEM_NOT_FOUND"
      | "RETURN_WINDOW_EXPIRED"
      | "FINAL_SALE"
      | "NOT_DELIVERED"
      | "REPLACEMENT_NOT_ALLOWED",
  ) {
    super(message);
  }
}

export function lookupOrder(orderNumber: string, email: string): ToolResult {
  const normalizedOrder = orderNumber.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();
  const order = orders.find(
    (candidate) =>
      candidate.orderNumber.toUpperCase() === normalizedOrder &&
      candidate.email.toLowerCase() === normalizedEmail,
  );

  if (!order) {
    throw new ToolError(
      `We could not find that order and email combination. Please double-check both values or email ${SUPPORT_EMAIL}.`,
      "ORDER_NOT_FOUND",
    );
  }

  return { type: "order", order };
}

export function startReturn(orderNumber: string, sku: string, reason: string): ToolResult {
  const order = findOrder(orderNumber);
  const item = findItem(order, sku);

  if (item.finalSale || order.status === "final_sale") {
    throw new ToolError(
      `${item.name} is marked final sale, so it is not eligible for return. If you think this is a mistake, email ${SUPPORT_EMAIL}.`,
      "FINAL_SALE",
    );
  }

  if (order.status === "outside_return_window") {
    throw new ToolError(
      `This order is outside Northwind's 30-day return window, so we cannot start a self-service return. Email ${SUPPORT_EMAIL} if you need help.`,
      "RETURN_WINDOW_EXPIRED",
    );
  }

  if (order.status !== "delivered" && order.status !== "delivered_damaged") {
    throw new ToolError("Returns can only be started after an order has been delivered.", "NOT_DELIVERED");
  }

  return {
    type: "return",
    orderNumber: order.orderNumber,
    item,
    reason,
    labelUrl: `https://labels.northwind.example/${order.orderNumber}-${item.sku}.pdf`,
    refundEstimate: "Refund posts 5-7 business days after the carrier scans your package.",
    message: `Your return for ${item.name} is started. Use the fake label below and drop it off within 7 days.`,
  };
}

export function startExchange(orderNumber: string, sku: string, newSize: string): ToolResult {
  const order = findOrder(orderNumber);
  const item = findItem(order, sku);

  if (item.finalSale || order.status === "final_sale") {
    throw new ToolError(
      `${item.name} is final sale, so it is not eligible for size exchange. Email ${SUPPORT_EMAIL} if you need help.`,
      "FINAL_SALE",
    );
  }

  if (order.status === "outside_return_window") {
    throw new ToolError(
      `This order is outside the exchange window, so we cannot start a self-service size swap.`,
      "RETURN_WINDOW_EXPIRED",
    );
  }

  if (order.status !== "delivered" && order.status !== "delivered_damaged") {
    throw new ToolError("Exchanges can only be started after an order has been delivered.", "NOT_DELIVERED");
  }

  return {
    type: "exchange",
    orderNumber: order.orderNumber,
    item,
    oldSize: item.size,
    newSize: newSize.trim().toUpperCase(),
    message: `We reserved ${item.name} in size ${newSize.trim().toUpperCase()}. Ship back the original item within 7 days.`,
  };
}

export function approveReplacement(orderNumber: string, sku: string, reason: string): ToolResult {
  const order = findOrder(orderNumber);
  const item = findItem(order, sku);

  if (item.finalSale || order.status === "final_sale") {
    throw new ToolError(
      `This item is final sale, so automatic replacement is not available. Please email ${SUPPORT_EMAIL} with your photo.`,
      "FINAL_SALE",
    );
  }

  if (order.status !== "delivered_damaged" && order.status !== "delivered") {
    throw new ToolError(
      "Replacement approvals are only available after delivery. If the package is still in transit, wait for delivery or email support.",
      "REPLACEMENT_NOT_ALLOWED",
    );
  }

  return {
    type: "replacement",
    orderNumber: order.orderNumber,
    item,
    reason,
    confirmationNumber: `RPL-${order.orderNumber.replace("NW-", "")}-${item.sku.split("-").at(-1)}`,
    message: `Replacement approved for ${item.name}. A new item will ship in 1-2 business days.`,
  };
}

function findOrder(orderNumber: string): Order {
  const normalizedOrder = orderNumber.trim().toUpperCase();
  const order = orders.find((candidate) => candidate.orderNumber.toUpperCase() === normalizedOrder);

  if (!order) {
    throw new ToolError(`Order ${orderNumber} was not found.`, "ORDER_NOT_FOUND");
  }

  return order;
}

function findItem(order: Order, sku: string): OrderItem {
  const normalizedSku = sku.trim().toUpperCase();
  const item = order.items.find((candidate) => candidate.sku.toUpperCase() === normalizedSku);

  if (!item) {
    throw new ToolError(`We could not find SKU ${sku} on order ${order.orderNumber}.`, "ITEM_NOT_FOUND");
  }

  return item;
}
