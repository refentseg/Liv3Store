import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { cn } from "@/lib/utils";
import {} from "next-auth/react"

const inter = Inter({ subsets: ["latin"],
variable: "--font-sans", });

export const metadata: Metadata = {
  title: "Liv3 Store",
  description: "Live Forever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}>{children}</body>
    </html>
  );
}
