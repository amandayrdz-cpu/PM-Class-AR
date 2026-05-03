export type OrderItem = {
  product: string;
  size: string;
  color: string;
  qty: number;
};

export type Order = {
  order_id: string;
  customer_name: string;
  email: string;
  items: OrderItem[];
  order_date: string;
  shipping_status: "In Transit" | "Delivered" | "Pending";
  tracking_number: string | null;
  carrier: string | null;
  delivery_estimate: string;
  payment_status: "Paid";
  total: number;
};

export type SupportTicket = {
  ticket_id: string;
  order_id: string;
  issue_type: "Tracking" | "Return" | "Cancellation" | "Damaged Item";
  message: string;
  status: "Open";
  priority: "High" | "Medium";
};

export type Product = {
  name: string;
  sizes: string[];
  price: number;
};

export const orders: Order[] = [
  {
    order_id: "ORD-1001",
    customer_name: "Jessica Taylor",
    email: "jessica.taylor@email.com",
    items: [
      { product: "Classic White T-Shirt", size: "M", color: "White", qty: 1 },
      { product: "High Waisted Jeans", size: "8", color: "Blue", qty: 1 },
    ],
    order_date: "2026-04-20",
    shipping_status: "In Transit",
    tracking_number: "TRK123456US",
    carrier: "UPS",
    delivery_estimate: "2026-04-25",
    payment_status: "Paid",
    total: 89.98,
  },
  {
    order_id: "ORD-1002",
    customer_name: "Marcus Green",
    email: "marcus.green@email.com",
    items: [{ product: "Oversized Hoodie", size: "L", color: "Black", qty: 1 }],
    order_date: "2026-04-18",
    shipping_status: "Delivered",
    tracking_number: "TRK654321US",
    carrier: "FedEx",
    delivery_estimate: "2026-04-22",
    payment_status: "Paid",
    total: 49.99,
  },
  {
    order_id: "ORD-1003",
    customer_name: "Alicia Brown",
    email: "alicia.brown@email.com",
    items: [{ product: "Summer Dress", size: "S", color: "Yellow", qty: 1 }],
    order_date: "2026-04-19",
    shipping_status: "Pending",
    tracking_number: null,
    carrier: null,
    delivery_estimate: "2026-04-27",
    payment_status: "Paid",
    total: 59.99,
  },
];

export const supportTickets: SupportTicket[] = [
  {
    ticket_id: "TCK-2001",
    order_id: "ORD-1001",
    issue_type: "Tracking",
    message: "Where is my order? It hasn't moved in 3 days.",
    status: "Open",
    priority: "High",
  },
  {
    ticket_id: "TCK-2002",
    order_id: "ORD-1002",
    issue_type: "Return",
    message: "I want to return the hoodie. It's too big.",
    status: "Open",
    priority: "Medium",
  },
  {
    ticket_id: "TCK-2003",
    order_id: "ORD-1003",
    issue_type: "Cancellation",
    message: "Can I cancel this order before it ships?",
    status: "Open",
    priority: "High",
  },
  {
    ticket_id: "TCK-2004",
    order_id: "ORD-1002",
    issue_type: "Damaged Item",
    message: "The hoodie arrived with a tear on the sleeve.",
    status: "Open",
    priority: "High",
  },
];

export const policies = {
  return_policy: {
    window_days: 30,
    conditions: "Items must be unworn, unwashed, and with tags attached.",
    refund_method: "Original payment method",
    processing_time_days: 5,
  },
  exchange_policy: {
    allowed: true,
    notes: "Exchanges allowed for size or color only",
  },
  shipping_policy: {
    standard_delivery_days: "5-7 business days",
    expedited_delivery_days: "2-3 business days",
  },
};

export const products: Product[] = [
  { name: "Classic White T-Shirt", sizes: ["S", "M", "L", "XL"], price: 19.99 },
  { name: "High Waisted Jeans", sizes: ["6", "8", "10", "12"], price: 69.99 },
  { name: "Oversized Hoodie", sizes: ["S", "M", "L"], price: 49.99 },
  { name: "Summer Dress", sizes: ["XS", "S", "M"], price: 59.99 },
];

export const testPrompts = [
  "Where is my order ORD-1001?",
  "I want to return my jeans from order ORD-1001",
  "My hoodie arrived damaged",
  "Can I cancel ORD-1003?",
  "I got the wrong size, I need a medium instead",
];

export function findOrderById(orderId: string) {
  return orders.find((order) => order.order_id.toLowerCase() === orderId.trim().toLowerCase());
}
