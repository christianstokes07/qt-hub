"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { SignInButton, UserButton, useUser, useClerk } from "@clerk/nextjs";

type Props = {
  active?: "internships" | "scholarships" | "resources" | "about";
};

export default function Navbar({ active }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

          {isSignedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-500 font-bold text-sm hover:border-pink-400 transition-colors">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0)?.toUpperCase() || "?"}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                  <Link href="/for-you" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors">
                    <span>⭐</span> For You
                  </Link>
                  <Link href="/saved" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors">
                    <span>❤️</span> My Saved
                  </Link>
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition-colors">
                    <span>👤</span> My Profile
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-pink-400 hover:bg-pink-500 text-white font-semibold px-5 py-2 rounded-full text-sm transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
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
          {isSignedIn ? (
            <>
              <div className="border-t border-gray-100 pt-2 flex flex-col gap-3">
                <Link href="/for-you" className="text-gray-700 font-medium hover:text-pink-500" onClick={() => setMenuOpen(false)}>⭐ For You</Link>
                <Link href="/saved" className="text-gray-700 font-medium hover:text-pink-500" onClick={() => setMenuOpen(false)}>❤️ My Saved</Link>
                <Link href="/profile" className="text-gray-700 font-medium hover:text-pink-500" onClick={() => setMenuOpen(false)}>👤 My Profile</Link>
                <button onClick={() => signOut()} className="text-left text-gray-500 font-medium hover:text-gray-700">🚪 Sign Out</button>
              </div>
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-pink-400 text-white font-semibold px-5 py-2 rounded-full text-center hover:bg-pink-500 transition-colors">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      )}
    </nav>
  );
}