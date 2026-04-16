import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import "./architect-ui.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ArchitectOS — Project Management & Code Backup",
  description:
    "Your personal cloud for code. Auto-sync local projects and access them anywhere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-clip bg-surface font-sans text-base leading-normal text-on-surface">
        {children}
      </body>
    </html>
  );
}
