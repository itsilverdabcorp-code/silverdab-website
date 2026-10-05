// components/navbar/Navbar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../icon/SDB LOGO ONLY 1.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/company" },
  { label: "Projects", href: "/projects" },
  { label: "Expertise", href: "/expertise" },
  { label: "Contact Us", href: "/contact" },
];

const HIDE_AFTER = 80; // px scrolled from top before the navbar can hide
const SHOW_DELTA = 8; // px of upward scroll needed to bring it back

export default function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = Math.max(window.scrollY, 0);
      const diff = y - lastY.current;

      if (y < HIDE_AFTER) {
        setHidden(false); // always visible near the top
      } else if (diff > 0) {
        setHidden(true); // scrolling down
      } else if (diff < -SHOW_DELTA) {
        setHidden(false); // scrolled up a little
      }

      if (Math.abs(diff) > SHOW_DELTA || diff > 0) lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A1D31] transition-transform duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="mx-auto grid w-full max-w-7xl grid-cols-3 items-center px-10 py-5">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Silverdab logo"
            className="h-8 w-auto"
            priority
          />
        </Link>

        <ul className="col-start-2 flex items-center justify-center gap-35 whitespace-nowrap">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-[#35A2CA] after:transition-transform after:duration-300 ${
                    active
                      ? "font-medium text-white after:scale-x-100"
                      : "font-normal text-zinc-400 after:scale-x-0 hover:text-white hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
