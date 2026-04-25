import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GMAT Premium Study",
  description: "Personalized GMAT Focus study plan and guided practice.",
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

