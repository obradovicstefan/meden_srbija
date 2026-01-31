"use client";

import Image from "next/image";
import { useState } from "react";
import RevealOnScroll from "./RevealOnScroll";

const PHONE_BOGDAN = "064 974 5589";
const PHONE_BOGDAN_HREF = "tel:+381649745589";
const PHONE_BOJAN = "062 119 8196";
const PHONE_BOJAN_HREF = "tel:+381621198196";
const EMAIL = "office@medensrbija.com";
const EMAIL_HREF = "mailto:office@medensrbija.com";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "";
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "";
    const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ?? "";

    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(typeof data.error === "string" ? data.error : "Slanje poruke nije uspelo. Pokušajte ponovo.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Slanje poruke nije uspelo. Proverite internet konekciju i pokušajte ponovo.");
    }
  }

  return (
    <section
      id="kontakt"
      className="border-t border-white/10 bg-[var(--background)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="contact-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="contact-title"
          className="mb-6 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:mb-8 sm:text-4xl lg:text-5xl"
        >
          Kontakt
        </h2>

        <RevealOnScroll>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <p className="text-base leading-relaxed text-[var(--foreground)]/80 sm:text-lg">
              Javite nam se putem telefona ili e-pošte. Radujemo se vašim porukama.
            </p>

            <ul className="space-y-6" aria-label="Kontakt informacije">
              <li className="flex items-center gap-4">
                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                  <Image
                    src="/images/socials/phone.webp"
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                    sizes="28px"
                  />
                </span>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="sr-only">Telefon:</span>
                  <a
                    href={PHONE_BOGDAN_HREF}
                    className="text-[var(--foreground)] hover:text-amber-400/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
                  >
                    Bogdan {PHONE_BOGDAN}
                  </a>
                  <span className="text-[var(--foreground)]/50">/</span>
                  <a
                    href={PHONE_BOJAN_HREF}
                    className="text-[var(--foreground)] hover:text-amber-400/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
                  >
                    Bojan {PHONE_BOJAN}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                  <Image
                    src="/images/socials/email.webp"
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                    sizes="28px"
                  />
                </span>
                <div>
                  <span className="sr-only">E-pošta:</span>
                  <a
                    href={EMAIL_HREF}
                    className="text-[var(--foreground)] hover:text-amber-400/90 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
                  >
                    {EMAIL}
                  </a>
                </div>
              </li>
            </ul>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-8" aria-labelledby="isporuka-title">
              <h3 id="isporuka-title" className="text-lg font-semibold text-[var(--foreground)] sm:text-xl">
                Isporuka
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]/85 sm:text-lg">
                U saradnji sa <strong className="text-[var(--foreground)]/95">BEX</strong> kurirskom službom vršimo isporuku na teritoriji cele Srbije.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[var(--foreground)]/85 sm:text-lg">
                Isporuka paketa traje <strong className="text-[var(--foreground)]/95">između 3 i 5 radnih dana</strong> od momenta slanja.
              </p>
            </div>
          </div>

          <form
            className="space-y-6 rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-8"
            noValidate
            aria-label="Kontakt forma"
            onSubmit={handleSubmit}
          >
            <div>
              <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Ime i prezime
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Vaše ime"
                className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                E-pošta
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="vas@email.rs"
                className="w-full rounded-md border border-white/20 bg-white/5 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                Poruka
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Vaša poruka..."
                className="w-full resize-y rounded-md border border-white/20 bg-white/5 px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground)]/50 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/30 min-h-[120px]"
              />
            </div>
            {status === "success" && (
              <p className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400" role="status">
                Poruka je uspešno poslata. Javićemo vam se uskoro.
              </p>
            )}
            {status === "error" && errorMessage && (
              <p className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-hover-lift w-full rounded-md border border-amber-400/40 bg-amber-400/10 py-3 text-sm font-medium text-amber-400 transition-colors hover:bg-amber-400/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-60 disabled:pointer-events-none sm:w-auto sm:px-8"
            >
              {status === "sending" ? "Šaljem…" : "Pošalji poruku"}
            </button>
          </form>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
