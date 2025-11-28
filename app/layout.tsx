'use client';

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { ReduxProvider } from "@/lib/providers/ReduxProvider";

export const metadata = {
  title: "Pollify",
  description: "Create, vote, and decide together. Your voice matters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Pollify</title>
        <meta name="description" content="Create, vote, and decide together. Your voice matters." />
      </head>
      <body className="bg-white text-[#1A1A1A]">
        <ReduxProvider>
          {/* Global Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="min-h-screen">{children}</main>

          {/* Global Footer */}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}