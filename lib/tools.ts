import { orders, policies, products, supportTickets, type Order, type OrderItem, type Product } from "./mock-data";

export type ToolResult =
  | { type: "order"; order: Order; relatedTickets: typeof supportTickets }
  | {
      type: "return";
      orderId: string;
      item: OrderItem;
      reason: string;
      refundAmount: number;
      labelUrl: string;
      refundEstimate: string;
      message: string;
    }
  | {
      type: "exchange";
      orderId: string;
      item: OrderItem;
      product: Product;
      oldSize: string;
      newSize: string;
      oldColor: string;
      newColor?: string;
      message: string;
    }
  | {
      type: "replacement";
      orderId: string;
      item: OrderItem;
      reason: string;
      confirmationNumber: string;
      message: string;
    };

export const SUPPORT_EMAIL = "support@shein-training.example";

export class ToolError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "ORDER_NOT_FOUND"
      | "ITEM_NOT_FOUND"
      | "RETURN_WINDOW_EXPIRED"
      | "NOT_DELIVERED"
      | "SIZE_UNAVAILABLE"
      | "EXCHANGE_TARGET_REQUIRED"
      | "REPLACEMENT_NOT_ALLOWED",
  ) {
    super(message);
  }
}

export function lookupOrder(orderId: string, email: string): ToolResult {
  const normalizedOrder = orderId.trim().toUpperCase();
  const normalizedEmail = email.trim().toLowerCase();
  const order = orders.find(
    (candidate) => candidate.order_id.toUpperCase() === normalizedOrder && candidate.email.toLowerCase() === normalizedEmail,
  );

  if (!order) {
    throw new ToolError(
      `We could not find that SHEIN order and email combination. Please double-check both values or email ${SUPPORT_EMAIL}.`,
      "ORDER_NOT_FOUND",
    );
  }

  return {
    type: "order",
    order,
    relatedTickets: supportTickets.filter((ticket) => ticket.order_id === order.order_id),
  };
}

export function startReturn(orderId: string, productName: string, reason: string): ToolResult {
  const order = findOrder(orderId);
  const item = findItem(order, productName);

  if (order.shipping_status !== "Delivered") {
    throw new ToolError("Returns can only be started after an order has been delivered.", "NOT_DELIVERED");
  }

  if (isOutsideReturnWindow(order.order_date)) {
    throw new ToolError(
      `This order is outside SHEIN's ${policies.return_policy.window_days}-day return window, so we cannot start a self-service return. Email ${SUPPORT_EMAIL} if you need help.`,
      "RETURN_WINDOW_EXPIRED",
    );
  }

  return {
    type: "return",
    orderId: order.order_id,
    item,
    reason,
    refundAmount: findProduct(item.product).price * item.qty,
    labelUrl: `https://returns.shein-training.example/${order.order_id}-${slugify(item.product)}.pdf`,
    refundEstimate: `${policies.return_policy.refund_method}; processing takes about ${policies.return_policy.processing_time_days} days after the package is scanned.`,
    message: `Your return for ${item.product} is started. Items must be ${policies.return_policy.conditions.toLowerCase()}`,
  };
}

export function startExchange(orderId: string, productName: string, newSize?: string, newColor?: string): ToolResult {
  const order = findOrder(orderId);
  const item = findItem(order, productName);
  const product = findProduct(item.product);
  const normalizedSize = newSize?.trim().toUpperCase() || item.size;
  const normalizedColor = newColor?.trim();

  if (!newSize?.trim() && !normalizedColor) {
    throw new ToolError("Tell me the new size or color you want before I start the exchange.", "EXCHANGE_TARGET_REQUIRED");
  }

  if (order.shipping_status !== "Delivered") {
    throw new ToolError("Exchanges can only be started after an order has been delivered.", "NOT_DELIVERED");
  }

  if (isOutsideReturnWindow(order.order_date)) {
    throw new ToolError(
      `This order is outside SHEIN's ${policies.return_policy.window_days}-day exchange window, so we cannot start a self-service size swap.`,
      "RETURN_WINDOW_EXPIRED",
    );
  }

  if (!product.sizes.map((size) => size.toUpperCase()).includes(normalizedSize)) {
    throw new ToolError(
      `${item.product} is not available in size ${normalizedSize}. Available sizes: ${product.sizes.join(", ")}.`,
      "SIZE_UNAVAILABLE",
    );
  }

  return {
    type: "exchange",
    orderId: order.order_id,
    item,
    product,
    oldSize: item.size,
    newSize: normalizedSize,
    oldColor: item.color,
    newColor: normalizedColor,
    message: `We reserved ${item.product} in ${normalizedColor ? `${normalizedColor}, ` : ""}size ${normalizedSize}. Ship back the original ${item.size} item with the return label instructions.`,
  };
}

export function approveReplacement(orderId: string, productName: string, reason: string): ToolResult {
  const order = findOrder(orderId);
  const item = findItem(order, productName);

  if (order.shipping_status !== "Delivered") {
    throw new ToolError(
      "Replacement approvals are only available after delivery. If the package is still in transit or pending, email support.",
      "REPLACEMENT_NOT_ALLOWED",
    );
  }

  return {
    type: "replacement",
    orderId: order.order_id,
    item,
    reason,
    confirmationNumber: `SHEIN-RPL-${order.order_id.replace("ORD-", "")}-${slugify(item.product).slice(0, 8).toUpperCase()}`,
    message: `Replacement approved for ${item.product}. A new item will ship after the claim is reviewed in this training flow.`,
  };
}

function findOrder(orderId: string): Order {
  const normalizedOrder = orderId.trim().toUpperCase();
  const order = orders.find((candidate) => candidate.order_id.toUpperCase() === normalizedOrder);

  if (!order) {
    throw new ToolError(`Order ${orderId} was not found.`, "ORDER_NOT_FOUND");
  }

  return order;
}

function findItem(order: Order, productName: string): OrderItem {
  const normalizedProduct = productName.trim().toLowerCase();
  const item = order.items.find(
    (candidate) =>
      candidate.product.toLowerCase() === normalizedProduct ||
      candidate.product.toLowerCase().includes(normalizedProduct) ||
      normalizedProduct.includes(candidate.product.toLowerCase()),
  );

  if (!item) {
    throw new ToolError(`We could not find ${productName} on order ${order.order_id}.`, "ITEM_NOT_FOUND");
  }

  return item;
}

function findProduct(productName: string): Product {
  const product = products.find((candidate) => candidate.name.toLowerCase() === productName.toLowerCase());

  if (!product) {
    throw new ToolError(`We could not find product information for ${productName}.`, "ITEM_NOT_FOUND");
  }

  return product;
}

function isOutsideReturnWindow(orderDate: string) {
  const placedAt = new Date(`${orderDate}T00:00:00Z`);
  const returnBy = new Date(placedAt);
  returnBy.setUTCDate(returnBy.getUTCDate() + policies.return_policy.window_days);
  return new Date() > returnBy;
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
