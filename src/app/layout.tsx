import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Netflix",
  description: "Clone app by RHLZ",
};


import ClientLayout from "./client-layout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
