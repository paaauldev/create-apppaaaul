import type { Metadata } from "next";

import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "{{name}}",
  description: "A project by Paaauldev",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] px-4 font-sans antialiased">
        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}
