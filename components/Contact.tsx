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

type FieldErrors = { name?: string; email?: string; message?: string };

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateFields(name: string, email: string, message: string): FieldErrors {
    const err: FieldErrors = {};
    if (!name.trim()) err.name = "Unesite ime i prezime.";
    if (!email.trim()) err.email = "Unesite e-poštu.";
    else if (!validateEmail(email)) err.email = "Unesite ispravnu e-poštu.";
    if (!message.trim()) err.message = "Unesite poruku.";
    return err;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "";
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "";
    const message = (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ?? "";

    const errors = validateFields(name, email, message);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
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
      setFieldErrors({});
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Slanje poruke nije uspelo. Proverite internet konekciju i pokušajte ponovo.");
    }
  }

  return (
    <section
      id="kontakt"
      className="contact-section border-t border-white/10 bg-[var(--background)]"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className="contact-heading text-[var(--foreground)]">
        Kontakt
      </h2>

      <RevealOnScroll>
        <div className="contact-grid">
          <div className="space-y-8">
            <p className="contact-subtitle">
              Javite nam se putem telefona ili e-pošte. Radujemo se vašim porukama.
            </p>

            <ul className="contact-info" aria-label="Kontakt informacije">
              <li className="contact-item">
                <div className="contact-icon">
                  <Image
                    src="/images/socials/phone.webp"
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                    sizes="28px"
                  />
                </div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="sr-only">Telefon:</span>
                  <a href={PHONE_BOGDAN_HREF} className="contact-link">
                    <span className="contact-text">Bogdan {PHONE_BOGDAN}</span>
                  </a>
                  <span className="contact-text-separator" aria-hidden="true">/</span>
                  <a href={PHONE_BOJAN_HREF} className="contact-link">
                    <span className="contact-text">Bojan {PHONE_BOJAN}</span>
                  </a>
                </div>
              </li>
              <li className="contact-item">
                <div className="contact-icon">
                  <Image
                    src="/images/socials/email.webp"
                    alt=""
                    width={28}
                    height={28}
                    className="object-contain"
                    sizes="28px"
                  />
                </div>
                <div>
                  <span className="sr-only">E-pošta:</span>
                  <a href={EMAIL_HREF} className="contact-link">
                    <span className="contact-text">{EMAIL}</span>
                  </a>
                </div>
              </li>
            </ul>

            <div className="delivery-box" aria-labelledby="isporuka-title">
              <h3 id="isporuka-title" className="delivery-heading">
                Isporuka
              </h3>
              <p className="delivery-text">
                U saradnji sa <strong>BEX</strong> kurirskom službom vršimo isporuku na teritoriji cele Srbije.
              </p>
              <p className="delivery-text">
                Isporuka paketa traje <strong>između 3 i 5 radnih dana</strong> od momenta slanja.
              </p>
            </div>
          </div>

          <form
            className="contact-form"
            noValidate
            aria-label="Kontakt forma"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">
                Ime i prezime
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Vaše ime"
                className={`form-input ${fieldErrors.name ? "error" : ""}`}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                onChange={() => setFieldErrors((prev) => ({ ...prev, name: undefined }))}
              />
              {fieldErrors.name && (
                <span id="contact-name-error" className="form-error-message" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">
                E-pošta
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="vas@email.rs"
                className={`form-input ${fieldErrors.email ? "error" : ""}`}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                onChange={() => setFieldErrors((prev) => ({ ...prev, email: undefined }))}
              />
              {fieldErrors.email && (
                <span id="contact-email-error" className="form-error-message" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">
                Poruka
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                placeholder="Vaša poruka..."
                className={`form-textarea ${fieldErrors.message ? "error" : ""}`}
                required
                aria-required="true"
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                onChange={() => setFieldErrors((prev) => ({ ...prev, message: undefined }))}
              />
              {fieldErrors.message && (
                <span id="contact-message-error" className="form-error-message" role="alert">
                  {fieldErrors.message}
                </span>
              )}
            </div>
            {status === "success" && (
              <p className="form-alert-success" role="status">
                Poruka je uspešno poslata. Javićemo vam se uskoro.
              </p>
            )}
            {status === "error" && errorMessage && (
              <p className="form-alert-error" role="alert">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className={`form-submit focus-ring-gold ${status === "sending" ? "loading" : ""}`}
            >
              {status === "sending" ? "Šaljem…" : "Pošalji poruku"}
            </button>
          </form>
        </div>
      </RevealOnScroll>
    </section>
  );
}
