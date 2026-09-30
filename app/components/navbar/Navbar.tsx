// components/navbar/Navbar.tsx
import Image from "next/image";
import Link from "next/link";
import logo from "../icon/SDB LOGO ONLY 1.png";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/company" },
  { label: "Projects", href: "/projects" },
  { label: "Expertise", href: "/expertise" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="w-full bg-[#0A1D31] border-b border-white/10">
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
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-medium font-normal text-zinc-200 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
