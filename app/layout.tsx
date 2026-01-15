import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TraderBuddy - Trading Journal",
  description: "Track and analyze your trades",
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
