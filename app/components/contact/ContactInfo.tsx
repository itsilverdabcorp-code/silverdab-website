import Reveal from "../Reveal"; // adjust path to where your Reveal lives

const offices = [
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
    address: [
      "Unit 2008 1 Fullerton Rd,",
      "#02-01 One Fullerton,",
      "Singapore 049213",
    ],
  },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0" fill="currentColor" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

export default function ContactInfo() {
  return (
    <div className="text-black">
      <Reveal>
        <p className="text-lg">Contact Us</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Let&apos;s Start Collaborating
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 max-w-md text-xl leading-snug">
          Our team is ready to discuss your project, answer questions, or
          explore how we can work together.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
      <ul className="mt-8 space-y-4 text-lg">
        <li className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v.38l-10 6.25L2 5.88V5.5Zm0 2.73V18.5A1.5 1.5 0 0 0 3.5 20h17a1.5 1.5 0 0 0 1.5-1.5V8.23l-9.47 5.92a1 1 0 0 1-1.06 0L2 8.23Z" />
          </svg>
          <a href="mailto:info@silverdab.com" className="hover:underline">
            info@silverdab.com
          </a>
        </li>
        <li className="flex items-center gap-4">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1L6.6 10.8Z" />
          </svg>
          <a href="tel:09099090909099" className="hover:underline">
            09099090909099
          </a>
        </li>
      </ul>
      </Reveal>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        {offices.map((o, i) => (
          <Reveal key={o.country} delay={0.5 + i * 0.1} className="flex gap-4">
            <PinIcon />
            <div>
              <h3 className="text-lg font-medium">{o.country}</h3>
              <address className="mt-3 text-sm not-italic leading-snug">
                {o.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.7} className="mt-10 flex items-center gap-4">
        <a href="#" aria-label="Facebook">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4v-7h2.5l.5-3h-3V9.5c0-.9.4-1.5 1.6-1.5H18V5.2c-.4-.1-1.4-.2-2.5-.2-2.4 0-4 1.4-4 4.1V11H9v3h2.5v7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
          </svg>
        </a>
        <a href="#" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
            <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm1.3 7.5V18h2.4v-7.5H6.3ZM7.5 6.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Zm3.2 4.3V18h2.4v-4c0-1.1.5-1.8 1.4-1.8s1.3.7 1.3 1.8V18h2.4v-4.6c0-2-1.1-3.1-2.7-3.1-1.1 0-1.8.6-2.1 1.1v-.9h-2.7Z" />
          </svg>
        </a>
        <a href="#" aria-label="Instagram">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </Reveal>
    </div>
  );
}