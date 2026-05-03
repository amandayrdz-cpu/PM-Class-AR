export type OrderStatus =
  | "processing"
  | "in_transit"
  | "delivered"
  | "lost"
  | "delivered_damaged"
  | "outside_return_window"
  | "final_sale";

export type OrderItem = {
  sku: string;
  name: string;
  size: string;
  price: number;
  image: string;
  finalSale?: boolean;
};

export type Shipment = {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  lastEvent: string;
};

export type Order = {
  orderNumber: string;
  email: string;
  placedAt: string;
  status: OrderStatus;
  returnBy?: string;
  items: OrderItem[];
  shipment: Shipment;
};

const imageFor = (label: string, bg: string) =>
  `https://placehold.co/160x160/${bg}/ffffff?text=${encodeURIComponent(label)}`;

export const orders: Order[] = [
  {
    orderNumber: "NW-1001",
    email: "mia@example.com",
    placedAt: "2026-04-20",
    status: "in_transit",
    returnBy: "2026-06-04",
    items: [
      { sku: "TEE-BLK-M", name: "Black Tee", size: "M", price: 35, image: imageFor("Black Tee", "111827") },
    ],
    shipment: {
      carrier: "UPS",
      trackingNumber: "1Z999NW1001",
      estimatedDelivery: "2026-05-05",
      lastEvent: "Out for delivery - Miami, FL",
    },
  },
  {
    orderNumber: "NW-1002",
    email: "alex@example.com",
    placedAt: "2026-04-12",
    status: "delivered",
    returnBy: "2026-05-27",
    items: [
      { sku: "HOOD-GRY-L", name: "Cloud Fleece Hoodie", size: "L", price: 88, image: imageFor("Hoodie", "6b7280") },
      { sku: "CAP-NVY-OS", name: "Northwind Cap", size: "OS", price: 28, image: imageFor("Cap", "1e3a8a") },
    ],
    shipment: {
      carrier: "USPS",
      trackingNumber: "9400NW1002",
      deliveredAt: "2026-04-17",
      lastEvent: "Delivered - Austin, TX",
    },
  },
  {
    orderNumber: "NW-1003",
    email: "sam@example.com",
    placedAt: "2026-04-25",
    status: "delivered",
    returnBy: "2026-06-09",
    items: [
      { sku: "JEAN-IND-32", name: "Everyday Denim", size: "32", price: 96, image: imageFor("Denim", "312e81") },
    ],
    shipment: {
      carrier: "FedEx",
      trackingNumber: "6129NW1003",
      deliveredAt: "2026-05-01",
      lastEvent: "Delivered - Portland, OR",
    },
  },
  {
    orderNumber: "NW-1004",
    email: "taylor@example.com",
    placedAt: "2026-03-10",
    status: "outside_return_window",
    returnBy: "2026-04-24",
    items: [
      { sku: "JKT-OLV-S", name: "Trail Jacket", size: "S", price: 140, image: imageFor("Jacket", "365314") },
    ],
    shipment: {
      carrier: "UPS",
      trackingNumber: "1Z999NW1004",
      deliveredAt: "2026-03-15",
      lastEvent: "Delivered - Denver, CO",
    },
  },
  {
    orderNumber: "NW-1005",
    email: "jordan@example.com",
    placedAt: "2026-04-03",
    status: "final_sale",
    returnBy: "2026-05-18",
    items: [
      {
        sku: "DRESS-RED-M",
        name: "Archive Wrap Dress",
        size: "M",
        price: 64,
        image: imageFor("Dress", "b91c1c"),
        finalSale: true,
      },
    ],
    shipment: {
      carrier: "USPS",
      trackingNumber: "9400NW1005",
      deliveredAt: "2026-04-08",
      lastEvent: "Delivered - Chicago, IL",
    },
  },
  {
    orderNumber: "NW-1006",
    email: "casey@example.com",
    placedAt: "2026-04-18",
    status: "delivered_damaged",
    returnBy: "2026-06-02",
    items: [
      { sku: "SHOE-WHT-9", name: "Court Sneaker", size: "9", price: 110, image: imageFor("Sneaker", "f8fafc") },
    ],
    shipment: {
      carrier: "FedEx",
      trackingNumber: "6129NW1006",
      deliveredAt: "2026-04-23",
      lastEvent: "Delivered with exception note - Brooklyn, NY",
    },
  },
  {
    orderNumber: "NW-1007",
    email: "riley@example.com",
    placedAt: "2026-04-01",
    status: "lost",
    returnBy: "2026-05-16",
    items: [
      { sku: "BAG-TAN-OS", name: "Canvas Weekender", size: "OS", price: 124, image: imageFor("Bag", "92400e") },
    ],
    shipment: {
      carrier: "UPS",
      trackingNumber: "1Z999NW1007",
      estimatedDelivery: "2026-04-08",
      lastEvent: "In transit delay - no scan since Apr 6",
    },
  },
  {
    orderNumber: "NW-1008",
    email: "quinn@example.com",
    placedAt: "2026-04-27",
    status: "processing",
    returnBy: "2026-06-11",
    items: [
      { sku: "POLO-BLU-XL", name: "Pique Polo", size: "XL", price: 52, image: imageFor("Polo", "1d4ed8") },
    ],
    shipment: {
      carrier: "UPS",
      trackingNumber: "Pending",
      estimatedDelivery: "2026-05-07",
      lastEvent: "Label created - waiting for carrier pickup",
    },
  },
  {
    orderNumber: "NW-1009",
    email: "avery@example.com",
    placedAt: "2026-04-14",
    status: "delivered",
    returnBy: "2026-05-29",
    items: [
      { sku: "SKIRT-BLK-S", name: "A-Line Skirt", size: "S", price: 72, image: imageFor("Skirt", "18181b") },
      { sku: "TEE-WHT-S", name: "White Tee", size: "S", price: 35, image: imageFor("White Tee", "e5e7eb") },
    ],
    shipment: {
      carrier: "USPS",
      trackingNumber: "9400NW1009",
      deliveredAt: "2026-04-19",
      lastEvent: "Delivered - Seattle, WA",
    },
  },
  {
    orderNumber: "NW-1010",
    email: "morgan@example.com",
    placedAt: "2026-04-22",
    status: "delivered_damaged",
    returnBy: "2026-06-06",
    items: [
      {
        sku: "SWEAT-GRN-M",
        name: "Final Sale Crewneck",
        size: "M",
        price: 48,
        image: imageFor("Crewneck", "166534"),
        finalSale: true,
      },
    ],
    shipment: {
      carrier: "FedEx",
      trackingNumber: "6129NW1010",
      deliveredAt: "2026-04-29",
      lastEvent: "Delivered - Atlanta, GA",
    },
  },
];

export const findOrder = (orderNumber: string, email: string) =>
  orders.find(
    (order) =>
      order.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() &&
      order.email.toLowerCase() === email.trim().toLowerCase(),
  );
