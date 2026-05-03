import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SHEIN Support Agent Demo",
  description: "Training landing page with an embedded SHEIN post-purchase support chatbot.",
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
