"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/trends", label: "Trends" },
  { href: "/insights", label: "Insights" },
  { href: "/sellers", label: "Sellers" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-b border-surface-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-neon-green font-mono tracking-tight">DURIAN</span>
            <span className="text-text-secondary font-mono">MKT</span>
            <span className="ml-1 text-xs text-neon-green/60 border border-neon-green/30 rounded px-1.5 py-0.5 font-mono">
              LIVE
            </span>
          </Link>
          <div className="flex gap-0.5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded text-sm font-medium font-mono transition-colors ${
                  pathname === link.href
                    ? "bg-neon-green/10 text-neon-green border border-neon-green/30"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
