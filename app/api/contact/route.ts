import { NextResponse } from "next/server";
import { Resend } from "resend";

const TO_EMAIL = "office@medensrbija.com";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      { error: "E-pošta nije konfigurisana. Dodajte RESEND_API_KEY u .env.local i ponovo pokrenite server." },
      { status: 503 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Neispravan zahtev." },
      { status: 400 }
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message || message.length < 10) {
    return NextResponse.json(
      { error: "Poruka mora imati najmanje 10 karaktera." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Unesite ispravnu e-poštu." },
      { status: 400 }
    );
  }

  const from = process.env.RESEND_FROM ?? "Kontakt sajta <onboarding@resend.dev>";
  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: TO_EMAIL,
      replyTo: email,
      subject: name ? `Kontakt sa sajta – ${name}` : "Kontakt sa sajta",
      text: [
        message,
        "",
        `Posiljalac: ${name || "(nije navedeno)"}`,
        `E-pošta: ${email}`,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend API error:", error);
      const errorMsg =
        typeof error.message === "string" && error.message
          ? error.message
          : "Slanje poruke nije uspelo. Proverite RESEND_API_KEY i domen u Resend dashboardu.";
      return NextResponse.json(
        { error: errorMsg },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    const errorMsg = err instanceof Error ? err.message : "Slanje poruke nije uspelo. Pokušajte ponovo.";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
