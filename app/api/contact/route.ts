import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message, website } = await req.json();

    // Honeypot: bots fill this hidden field, humans never see it
    if (website) return NextResponse.json({ ok: true });

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "Silverdab Website <no-reply@silverdab.com>",
      to: ["amorales@silverdab.com", "sramos@silverdab.com"],
      replyTo: email, // hitting Reply goes to the visitor
      subject: `New contact message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}