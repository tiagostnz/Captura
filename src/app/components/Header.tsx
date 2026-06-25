"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";


export default function Header() {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/signup") {
        return null;
    }
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
            <div className="max-w-md mx-auto px-4 py-3 text-center">
        <Link href="/" className="font-brand text-3xl text-foreground">
          Captura
        </Link>
      </div>

    </header>
  );
}
