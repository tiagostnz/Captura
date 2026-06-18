import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "./components/BottomNav";
import { Providers } from "./providers";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Captura",
  description: "",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
