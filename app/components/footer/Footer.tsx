import Image from "next/image";
import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Company", href: "/company" },
  { label: "Projects", href: "/projects" },
  { label: "Expertise", href: "/expertise" },
];

const OFFICES = [
  {
    country: "Philippines",
    address: [
      "7F Unit 3, Hexagon",
      "Corporate Center, 1471",
      "Quezon Avenue, Brgy. West",
      "Triangle, Quezon City",
      "Metro Manila Philippines 1104",
    ],
  },
  {
    country: "Singapore",
    address: ["Unit 2008 1 Fullerton Rd,", "#02-01 One Fullerton,", "Singapore 049213"],
  },
];

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com", Icon: FaFacebookSquare },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: FaLinkedin },
  { label: "Instagram", href: "https://instagram.com", Icon: FaInstagramSquare },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a1c30] text-white">
      <div className="mx-auto w-full max-w-7xl px-10 pt-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_1.2fr_1.3fr_1.3fr]">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-8">
            <Link href="/">
              <Image
                src="/images/logo-white.png"
                alt="Silverdab"
                width={200}
                height={56}
                className="h-auto w-48"
              />
            </Link>
            <p className="max-w-xs text-sm leading-snug text-zinc-100">
              Silverdab delivers BIM and Digital Engineering solutions for
              infrastructure projects across Asia-Pacific
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xl font-normal">Links</h3>
            <ul className="mt-3 flex flex-col gap-5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-zinc-300 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-normal">Contact Us</h3>
            <ul className="mt-3 flex flex-col gap-5 text-sm text-zinc-300">
              <li className="flex items-center gap-4">
                <FaEnvelope className="shrink-0 text-lg text-white" />
                <a
                  href="mailto:info@silverdab.com"
                  className="transition-colors hover:text-white"
                >
                  info@silverdab.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <FaPhoneAlt className="shrink-0 text-lg text-white" />
                <a
                  href="tel:09099090909099"
                  className="transition-colors hover:text-white"
                >
                  09099090909099
                </a>
              </li>
            </ul>
          </div>

          {/* Offices */}
          {OFFICES.map((o) => (
            <div key={o.country}>
              <h3 className="flex items-center gap-3 text-xl font-normal">
                <FaMapMarkerAlt className="shrink-0 text-lg" />
                {o.country}
              </h3>
              <address className="mt-3 text-sm not-italic leading-snug text-zinc-300">
                {o.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#1b3a5c] py-8">
          <p className="text-sm text-zinc-200">
            &copy; {new Date().getFullYear()} Silverdab Corporation. All rights
            reserved
          </p>

          <div className="flex items-center gap-4">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-2xl text-white transition-opacity hover:opacity-70"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}