"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "../Reveal"; // adjust path

const countries = [
  { code: "ph", dial: "+63", name: "Philippines" },
  { code: "sg", dial: "+65", name: "Singapore" },
  { code: "us", dial: "+1", name: "United States" },
  { code: "gb", dial: "+44", name: "United Kingdom" },
  { code: "au", dial: "+61", name: "Australia" },
  { code: "jp", dial: "+81", name: "Japan" },
];

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-[#36A2CC] focus:ring-2 focus:ring-[#36A2CC]/20";
const labelCls = "mb-1.5 block text-xs font-medium text-black";

export default function ContactForm() {
  const [country, setCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      // TODO: replace with your real endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, dialCode: country.dial }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Reveal delay={0.15}>
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-[#F1F1F1] p-4 sm:p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Reveal delay={0.3}>
          <label htmlFor="firstName" className={labelCls}>First Name</label>
          <input id="firstName" name="firstName" required placeholder="First" className={inputCls} />
        </Reveal>
        <Reveal delay={0.4}>
          <label htmlFor="lastName" className={labelCls}>Last Name</label>
          <input id="lastName" name="lastName" required placeholder="Last" className={inputCls} />
        </Reveal>
      </div>

      <Reveal delay={0.5} className="mt-4">
        <label htmlFor="email" className={labelCls}>Email</label>
        <input id="email" name="email" type="email" required placeholder="@gmail.com" className={inputCls} />
      </Reveal>

      <Reveal delay={0.6} className="relative z-30 mt-4">
        <label htmlFor="phone" className={labelCls}>Phone Number</label>
        <div className="flex rounded-lg border border-gray-200 bg-white focus-within:border-[#36A2CC] focus-within:ring-2 focus-within:ring-[#36A2CC]/20">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-full items-center gap-2 border-r border-gray-200 px-3 text-sm text-black"
              aria-haspopup="listbox"
              aria-expanded={open}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://flagcdn.com/w20/${country.code}.png`} alt="" className="h-3 w-4 rounded-[2px] object-cover" />
              <span>{country.dial}</span>
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {open && (
              <ul role="listbox" className="absolute left-0 top-full z-20 mt-1 max-h-56 w-52 overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-black shadow-lg">
                {countries.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => { setCountry(c); setOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-black hover:bg-gray-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://flagcdn.com/w20/${c.code}.png`} alt="" className="h-3 w-4 rounded-[2px] object-cover" />
                      <span className="flex-1">{c.name}</span>
                      <span className="text-gray-500">{c.dial}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="Number"
            className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400"
          />
        </div>
      </Reveal>

      <Reveal delay={0.7} className="mt-4">
        <label htmlFor="subject" className={labelCls}>Subject</label>
        <input id="subject" name="subject" placeholder="Silverdab Form" className={inputCls} />
      </Reveal>

      <Reveal delay={0.8} className="mt-4">
        <label htmlFor="message" className={labelCls}>Message</label>
        <textarea id="message" name="message" required rows={5} placeholder="Your message here" className={`${inputCls} resize-none`} />
      </Reveal>

      <Reveal delay={0.9} className="mt-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-[#36A2CC] py-3 text-sm font-medium text-white transition hover:bg-[#2c8fb6] disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Submit"}
        </button>
      </Reveal>

      {status === "sent" && (
        <p className="mt-3 text-xs text-green-700">Thanks! Your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs text-red-600">Something went wrong. Please try again.</p>
      )}

      <Reveal delay={1}>
      <p className="mt-4 text-[11px] text-black">
        Note: Please send your CV and portfolio to{" "}
        <a href="mailto:info@silverdab.com" className="text-blue-600 underline">
          info@silverdab.com
        </a>{" "}
        after submitting this form.
      </p>
      </Reveal>
    </form>
    </Reveal>
  );
}