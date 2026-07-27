"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "Our Story" },
  { href: "/menu", label: "Menu" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-teal-black text-warm-white">
      <div className="container-cafe flex items-center justify-between h-[68px]">
        <Link
          href="/"
          className="font-display font-semibold tracking-wide text-lg md:text-xl"
          onClick={() => setOpen(false)}
        >
          THE CAFE HEAVEN
        </Link>

        {/* desktop nav */}
        <nav className="hidden md:flex items-center gap-8 font-body text-[0.94rem] tracking-wide">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline-brass text-warm-white/90 hover:text-warm-white py-1"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+917853868956"
            className="ml-2 inline-flex items-center rounded-none border border-brass px-4 py-2 text-brass hover:bg-brass hover:text-teal-black transition-colors text-sm tracking-wide"
          >
            078538 68956
          </a>
        </nav>

        {/* mobile toggle */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-[1.5px] w-6 bg-brass transition-transform ${
              open ? "translate-y-[5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-brass mt-[9px] transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-[1.5px] w-6 bg-brass mt-[9px] transition-transform ${
              open ? "-translate-y-[15px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* mobile nav panel */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out border-t border-brass/20 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="container-cafe flex flex-col py-3 font-body text-[1.02rem]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 border-b border-warm-white/10 text-warm-white/90"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+917853868956"
            className="mt-4 mb-2 inline-flex justify-center items-center border border-brass px-4 py-3 text-brass"
          >
            Call 078538 68956
          </a>
        </nav>
      </div>
    </header>
  );
}
