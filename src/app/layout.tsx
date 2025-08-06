import "./globals.css";

import { StreamingMessage } from "@/components/streaming-messages/presentations/StreamingMessage";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";
import { Providers } from "./providers";

const font = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LocalAI",
  description:
    "Generate images with Stable Diffusion, run LLMs, and more, all on your local machine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="night">
      <body className={`${font.className} antialiased`}>
        <Providers>
          <ViewTransition>{children}</ViewTransition>
          <StreamingMessage />
        </Providers>
      </body>
    </html>
  );
}
