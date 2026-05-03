import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northwind Apparel Support",
  description: "Training build of a post-purchase support agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
