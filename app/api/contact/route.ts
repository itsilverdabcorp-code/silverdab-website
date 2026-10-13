import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, dialCode, subject, message, website } =
      await req.json();
    const name = `${firstName ?? ""} ${lastName ?? ""}`.trim();

    // Honeypot: bots fill this hidden field, humans never see it
    if (website) return NextResponse.json({ ok: true });

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"Silverdab Website" <${process.env.GMAIL_USER}>`,
      to: [
        "itsilverdabcorp@gmail.com",
        "amorales@silverdab.com",
        "sramos@silverdab.com",
      ],
      replyTo: email, // hitting Reply goes to the visitor
      subject: subject?.trim() || `New contact message from ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone ? `${dialCode ?? ""} ${phone}`.trim() : "N/A"}\n\n` +
        `${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    const isBadJson = err instanceof SyntaxError;
    return NextResponse.json(
      { error: isBadJson ? "Bad request" : "Server error" },
      { status: isBadJson ? 400 : 500 }
    );
  }
}