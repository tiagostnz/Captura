import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { Providers } from "./providers";



const louisGeorge = localFont({
  src: [
    { path: "./fonts/LouisGeorgeCafe.ttf", weight: "400", style: "normal" },
    { path: "./fonts/LouisGeorgeCafe-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const protest = localFont({
  src: "./fonts/ProtestDemo.otf",
  variable: "--font-brand",
  display: "swap",
});

export const metadata = {
  title: "Captura",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${louisGeorge.variable} ${protest.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pb-16">
        <Providers>
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}