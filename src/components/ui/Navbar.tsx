"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/trends", label: "Trends" },
  { href: "/insights", label: "Insights" },
  { href: "/sellers", label: "Sellers" },
];

const WHATSAPP_URL = "https://wa.me/6589422200";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-surface-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
            <span className="text-neon-green font-mono tracking-tight">DURIAN</span>
            <span className="text-text-secondary font-mono">MKT</span>
            <span className="ml-1 text-[9px] text-neon-green/60 border border-neon-green/30 rounded px-1 py-0.5 font-mono">
              LIVE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex gap-0.5">
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded text-sm font-medium font-mono transition-colors text-text-secondary hover:text-neon-green hover:bg-surface-light"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden flex flex-col gap-1 p-2"
            aria-label="Menu"
          >
            <span className={`block w-5 h-0.5 bg-text-secondary transition-transform ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block w-5 h-0.5 bg-text-secondary transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-text-secondary transition-transform ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="sm:hidden border-t border-surface-border pb-3 pt-2 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded text-sm font-medium font-mono transition-colors ${
                  pathname === link.href
                    ? "bg-neon-green/10 text-neon-green"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded text-sm font-medium font-mono transition-colors text-text-secondary hover:text-neon-green hover:bg-surface-light"
            >
              Contact Us
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
