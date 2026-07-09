import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "TableRay — prints de código e tabelas",
  description: "Gere imagens premium de blocos de código e tabelas markdown.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${jetbrainsMono.variable} antialiased`}>{children}</body>
    </html>
  );
}