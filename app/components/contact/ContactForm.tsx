"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "../Reveal"; // adjust path
import {
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  isValidPhoneNumber,
  type CountryCode,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

const countries = getCountries()
  .filter((c) => c !== "AC" && c !== "TA") // no flag images for these
  .map((c) => ({
    code: c.toLowerCase(),
    dial: `+${getCountryCallingCode(c)}`,
    name: regionNames.of(c) ?? c,
  }))
  .sort((a, b) => {
    if (a.code === "ph") return -1; // Philippines first, and the default
    if (b.code === "ph") return 1;
    return a.name.localeCompare(b.name);
  });

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-black placeholder:text-gray-400 outline-none focus:border-[#36A2CC]";
const labelCls = "mb-1.5 block text-xs font-medium text-black";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(countries[0]);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const example = getExampleNumber(country.code.toUpperCase() as CountryCode, examples);
  const phonePlaceholder =
  example?.formatInternational().replace(country.dial, "").trim() || "Phone number";
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const checkPhone = (value: string) => {
  const v = value.trim();
  if (!v) return ""; // phone is optional
  return isValidPhoneNumber(v, country.code.toUpperCase() as CountryCode)
    ? ""
    : "Incomplete or invalid number. Check the digits for the selected country.";
  };
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
    const email = String(data.email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email, like name@company.com.");
      return;
    }
    const phoneMsg = checkPhone(phone);
    if (phoneMsg) {
      setPhoneError(phoneMsg);
      return;
    }
    setEmailError("");
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
      setPhone("");
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
          <input id="firstName" name="firstName" required placeholder="First Name" className={inputCls} />
        </Reveal>
        <Reveal delay={0.4}>
          <label htmlFor="lastName" className={labelCls}>Last Name</label>
          <input id="lastName" name="lastName" required placeholder="Last Name" className={inputCls} />
        </Reveal>
      </div>

      <Reveal delay={0.5} className="mt-4">
      <label htmlFor="email" className={labelCls}>Email</label>
      <input
        id="email"
        name="email"
        type="text"
        inputMode="email"
        placeholder="name@company.com"
        className={inputCls}
        style={emailError ? { borderColor: "#ef4444" } : undefined}
        onBlur={(e) => {
          const v = e.target.value.trim();
          setEmailError(
            v && !EMAIL_RE.test(v)
              ? "Not a valid email. Use a format like name@company.com."
              : ""
          );
        }}
        onChange={() => {
          if (emailError) setEmailError("");
        }}
      />
      {emailError && (
        <p className="mt-1 text-xs text-red-600">{emailError}</p>
      )}
    </Reveal>

      <Reveal delay={0.6} className="relative z-30 mt-4">
        <label htmlFor="phone" className={labelCls}>Phone Number</label>
        <div className="relative flex rounded-lg border border-gray-200 bg-white focus-within:border-[#36A2CC]">
          <div
              style={phoneError ? { borderColor: "#ef4444" } : undefined}
              className="relative flex rounded-md border border-gray-200 bg-white focus-within:border-[#36A2CC]"
            >
          </div>
          <div ref={dropdownRef}>
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
            <div className="absolute inset-x-0 top-full z-20 mt-1 rounded-lg border border-gray-200 bg-white text-black shadow-lg">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code"
                className="w-full rounded-t-lg border-b border-gray-200 px-3 py-2 text-sm outline-none placeholder:text-gray-400"
              />
              <ul role="listbox" className="max-h-56 overflow-auto py-1">
                {countries
                  .filter(
                    (c) =>
                      c.name.toLowerCase().includes(query.toLowerCase()) ||
                      c.dial.includes(query)
                  )
                  .map((c) => (
                    <li key={c.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setCountry(c);
                          setOpen(false);
                          setQuery("");
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-black hover:bg-gray-100"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://flagcdn.com/w20/${c.code}.png`}
                          alt=""
                          className="h-3 w-4 rounded-[2px] object-cover"
                        />
                        <span className="flex-1">{c.name}</span>
                        <span className="text-gray-500">{c.dial}</span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^\d\s-]/g, ""));
              if (phoneError) setPhoneError("");
            }}
            onBlur={() => setPhoneError(checkPhone(phone))}
            placeholder={phonePlaceholder}
            className="min-w-0 flex-1 rounded-r-lg bg-transparent px-3 py-2.5 text-sm text-black outline-none placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-0"
          />
        </div>
        {phoneError && <p className="mt-1 text-xs text-red-600">{phoneError}</p>}
      </Reveal>

      <Reveal delay={0.7} className="mt-4">
        <label htmlFor="subject" className={labelCls}>Subject</label>
        <input id="subject" name="subject" placeholder="How can we help?" className={inputCls} />
      </Reveal>

      <Reveal delay={0.8} className="mt-4">
        <label htmlFor="message" className={labelCls}>Message</label>
        <textarea id="message" name="message" required rows={5} placeholder="Tell us about your project or inquiry" className={`${inputCls} resize-none`} />
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
      <p className="mt-4 text-[13px] text-black">
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