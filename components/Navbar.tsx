"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Props = {
  active?: "internships" | "scholarships" | "resources" | "about";
};

export default function Navbar({ active }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/internships", label: "Internships" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/resources",    label: "Resources"    },
    { href: "/about",        label: "About"        },
  ];

  return (
    <nav className="bg-white border-b border-pink-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <Image src="/QTlogo.png" alt="QT Hub" width={120} height={40} className="object-contain" priority />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                active === link.label.toLowerCase()
                  ? "text-pink-500 font-semibold border-b-2 border-pink-300 pb-0.5"
                  : "text-gray-500 hover:text-pink-500 font-medium transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                active === link.label.toLowerCase()
                  ? "text-pink-500 font-semibold"
                  : "text-gray-700 font-medium hover:text-pink-500"
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/internships"
            className="bg-pink-400 text-white font-semibold px-5 py-2 rounded-full text-center hover:bg-pink-500 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}