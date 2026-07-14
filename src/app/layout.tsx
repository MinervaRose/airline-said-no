import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Airline Said No",
  description: "An explainable second opinion on airline refusals.",
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
