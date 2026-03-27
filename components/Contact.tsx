"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Truck } from "lucide-react";

const PHONE_BOGDAN = "064 974 5589";
const PHONE_BOGDAN_HREF = "tel:+381649745589";
const PHONE_BOJAN = "062 119 8196";
const PHONE_BOJAN_HREF = "tel:+381621198196";
const EMAIL = "office@medensrbija.com";
const EMAIL_HREF = "mailto:office@medensrbija.com";
const LOCATION = "Beograd, Srbija";

const contactItems = [
  {
    id: "phone",
    label: "TELEFON",
    value: (
      <>
        <a href={PHONE_BOGDAN_HREF} className="hover:text-[#c9920a]">
          {PHONE_BOGDAN}
        </a>
        <span
          className="mx-3 inline-block h-[4px] w-[4px] rounded-full bg-[#c9920a]"
          aria-hidden="true"
        />
        <a href={PHONE_BOJAN_HREF} className="hover:text-[#c9920a]">
          {PHONE_BOJAN}
        </a>
      </>
    ),
    subtext: "Bogdan & Bojan · Pon–Sub 08–20h",
    icon: Phone,
  },
  {
    id: "mail",
    label: "E-POŠTA",
    value: (
      <a href={EMAIL_HREF} className="hover:text-[#c9920a]">
        {EMAIL}
      </a>
    ),
    subtext: "Odgovaramo u roku od 24 sata",
    icon: Mail,
  },
  {
    id: "location",
    label: "LOKACIJA",
    value: LOCATION,
    icon: MapPin,
  },
] as const;

type FieldErrors = {
  name?: string;
  surname?: string;
  email?: string;
  message?: string;
};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function Contact() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateFields(
    name: string,
    surname: string,
    email: string,
    message: string,
  ): FieldErrors {
    const err: FieldErrors = {};
    if (!name.trim()) err.name = "Unesite ime.";
    if (!surname.trim()) err.surname = "Unesite prezime.";
    if (!email.trim()) err.email = "Unesite e-poštu.";
    else if (!validateEmail(email)) err.email = "Unesite ispravnu e-poštu.";
    if (!message.trim()) err.message = "Unesite poruku.";
    return err;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const nameValue =
      (form.querySelector('[name="name"]') as HTMLInputElement)?.value ?? "";
    const surname =
      (form.querySelector('[name="surname"]') as HTMLInputElement)?.value ?? "";
    const email =
      (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "";
    const message =
      (form.querySelector('[name="message"]') as HTMLTextAreaElement)?.value ??
      "";
    const phone =
      (form.querySelector('[name="phone"]') as HTMLInputElement)?.value ?? "";
    const name = `${nameValue.trim()} ${surname.trim()}`.trim();

    const errors = validateFields(nameValue, surname, email, message);
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
        body: JSON.stringify({ name, email, phone, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(
          typeof data.error === "string"
            ? data.error
            : "Slanje poruke nije uspelo. Pokušajte ponovo.",
        );
        return;
      }
      setStatus("success");
      setFieldErrors({});
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage(
        "Slanje poruke nije uspelo. Proverite internet konekciju i pokušajte ponovo.",
      );
    }
  }

  return (
    <section
      id="kontakt"
      className="bg-[#0a0805]"
      aria-labelledby="contact-heading"
    >
      {/* Full-bleed section divider (between previous section and contact content) */}
      <div
        className="w-full"
        aria-hidden="true"
        role="presentation"
      >
        <div className="h-px w-full bg-white/[0.07] motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:80ms]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-5 pb-24 pt-12 md:px-20 md:pt-16 md:pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <header className="space-y-6 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:180ms]">
              <div className="flex items-center gap-4">
                <span className="h-7 w-[2px] bg-[#c9920a]" aria-hidden="true" />
                <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#c9920a]">
                  STUPITE U KONTAKT
                </p>
              </div>
              <h2
                id="contact-heading"
                className="font-serif text-4xl font-light text-[#f0e8d8] md:text-6xl"
              >
                Razgovarajmo o{" "}
                <span className="italic text-[#c9920a]">medu</span>
              </h2>
            </header>

            <p className="max-w-[52ch] font-sans text-base text-[#f0e8d8]/50">
              Javite nam se putem telefona ili e-pošte. Radujemo se vašim
              porukama i narudžbinama.
            </p>

            <ul
              className="border-y border-[#c9920a]/20 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:280ms]"
              aria-label="Kontakt informacije"
            >
              {contactItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li
                    key={item.id}
                    className={`group relative py-6 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] ${
                      index === 0
                        ? "[animation-delay:340ms]"
                        : index === 1
                          ? "[animation-delay:420ms]"
                          : "[animation-delay:500ms]"
                    } ${index > 0 ? "border-t border-[#c9920a]/20" : ""}`}
                  >
                    <span
                      className="pointer-events-none absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#c9920a] to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100"
                      aria-hidden="true"
                    />
                    <div className="flex items-center gap-4">
                      <div className="grid h-11 w-11 place-items-center border border-[#c9920a]/20 bg-[#110e09] transition-colors duration-300 group-hover:border-[#c9920a]/40 group-hover:bg-[#c9920a]/15">
                        <Icon
                          className="h-[18px] w-[18px] text-[#f0e8d8]/80 transition-colors duration-300 group-hover:text-[#f0e8d8]"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#f0e8d8]/50">
                          {item.label}
                        </p>
                        <p className="font-serif text-[27px] font-light leading-none text-[#f0e8d8]">
                          {item.value}
                        </p>
                        {"subtext" in item && item.subtext ? (
                          <p className="font-sans text-xs text-[#f0e8d8]/50">
                            {item.subtext}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div
              className="relative border border-[#c9920a]/20 bg-[#110e09] p-7 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:560ms]"
              aria-labelledby="isporuka-title"
            >
              <span
                className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 border-[#c9920a]"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 border-[#c9920a]"
                aria-hidden="true"
              />

              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center bg-[#c9920a]/10 text-[#c9920a]">
                  <Truck className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <h3
                  id="isporuka-title"
                  className="font-serif text-3xl font-light text-[#f0e8d8]"
                >
                  Isporuka
                </h3>
              </div>

              <p className="font-sans text-sm leading-relaxed text-[#f0e8d8]/80">
                U saradnji sa{" "}
                <strong className="font-semibold text-[#c9920a]">BEX</strong>{" "}
                kurirskom službom vršimo isporuku na teritoriji cele Srbije.
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#f0e8d8]/80">
                Paketi stižu za{" "}
                <strong className="font-semibold text-[#c9920a]">
                  3–5 radnih dana
                </strong>{" "}
                od momenta slanja.
              </p>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[720px] relative lg:max-w-none lg:pl-6 lg:pl-10">
            <span
              className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-px bg-gradient-to-b from-transparent via-[#c9920a]/40 to-transparent lg:block"
              aria-hidden="true"
            />
            <form
              className="relative border border-[#c9920a]/20 bg-[#110e09] p-8 md:p-12 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:300ms]"
              noValidate
              aria-label="Kontakt forma"
              onSubmit={handleSubmit}
            >
              <span
                className="pointer-events-none absolute -right-px -top-px h-6 w-6 border-r-2 border-t-2 border-[#c9920a]"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-[#c9920a]"
                aria-hidden="true"
              />

              <div className="relative z-10 space-y-5">
                <header className="space-y-3 pb-2">
                  <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-[#c9920a]">
                    POŠALJITE PORUKU
                  </p>
                  <h3 className="font-serif text-4xl font-light text-[#f0e8d8] md:text-5xl">
                    Naručite ili{" "}
                    <span className="italic text-[#c9920a]">
                      postavite pitanje
                    </span>
                  </h3>
                </header>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="font-sans text-xs text-[#f0e8d8]/70"
                    >
                      Ime
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      autoComplete="given-name"
                      placeholder="Ime"
                      className={`w-full border bg-[#c9920a]/[0.03] px-4 py-3 font-sans text-sm text-[#f0e8d8] placeholder:font-serif placeholder:italic placeholder:text-[#f0e8d8]/50 focus:border-[#c9920a]/40 focus:bg-[#c9920a]/[0.05] focus:outline-none focus:ring-2 focus:ring-[#c9920a]/20 ${
                        fieldErrors.name
                          ? "border-red-400/60"
                          : "border-[#c9920a]/20"
                      }`}
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={
                        fieldErrors.name ? "contact-name-error" : undefined
                      }
                      onChange={() =>
                        setFieldErrors((prev) => ({ ...prev, name: undefined }))
                      }
                    />
                    {fieldErrors.name && (
                      <span
                        id="contact-name-error"
                        className="font-sans text-xs text-red-300"
                        role="alert"
                      >
                        {fieldErrors.name}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="contact-surname"
                      className="font-sans text-xs text-[#f0e8d8]/70"
                    >
                      Prezime
                    </label>
                    <input
                      id="contact-surname"
                      type="text"
                      name="surname"
                      autoComplete="family-name"
                      placeholder="Prezime"
                      className={`w-full border bg-[#c9920a]/[0.03] px-4 py-3 font-sans text-sm text-[#f0e8d8] placeholder:font-serif placeholder:italic placeholder:text-[#f0e8d8]/50 focus:border-[#c9920a]/40 focus:bg-[#c9920a]/[0.05] focus:outline-none focus:ring-2 focus:ring-[#c9920a]/20 ${
                        fieldErrors.surname
                          ? "border-red-400/60"
                          : "border-[#c9920a]/20"
                      }`}
                      required
                      aria-required="true"
                      aria-invalid={!!fieldErrors.surname}
                      aria-describedby={
                        fieldErrors.surname
                          ? "contact-surname-error"
                          : undefined
                      }
                      onChange={() =>
                        setFieldErrors((prev) => ({
                          ...prev,
                          surname: undefined,
                        }))
                      }
                    />
                    {fieldErrors.surname && (
                      <span
                        id="contact-surname-error"
                        className="font-sans text-xs text-red-300"
                        role="alert"
                      >
                        {fieldErrors.surname}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-email"
                    className="font-sans text-xs text-[#f0e8d8]/70"
                  >
                    E-pošta
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="vas@email.rs"
                    className={`w-full border bg-[#c9920a]/[0.03] px-4 py-3 font-sans text-sm text-[#f0e8d8] placeholder:font-serif placeholder:italic placeholder:text-[#f0e8d8]/50 focus:border-[#c9920a]/40 focus:bg-[#c9920a]/[0.05] focus:outline-none focus:ring-2 focus:ring-[#c9920a]/20 ${
                      fieldErrors.email
                        ? "border-red-400/60"
                        : "border-[#c9920a]/20"
                    }`}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={
                      fieldErrors.email ? "contact-email-error" : undefined
                    }
                    onChange={() =>
                      setFieldErrors((prev) => ({ ...prev, email: undefined }))
                    }
                  />
                  {fieldErrors.email && (
                    <span
                      id="contact-email-error"
                      className="font-sans text-xs text-red-300"
                      role="alert"
                    >
                      {fieldErrors.email}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-phone"
                    className="font-sans text-xs text-[#f0e8d8]/70"
                  >
                    Telefon (opciono)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="06x xxx xxxx"
                    className="w-full border border-[#c9920a]/20 bg-[#c9920a]/[0.03] px-4 py-3 font-sans text-sm text-[#f0e8d8] placeholder:font-serif placeholder:italic placeholder:text-[#f0e8d8]/50 focus:border-[#c9920a]/40 focus:bg-[#c9920a]/[0.05] focus:outline-none focus:ring-2 focus:ring-[#c9920a]/20"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="font-sans text-xs text-[#f0e8d8]/70"
                  >
                    Vaša poruka
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="Vaša poruka..."
                    className={`w-full resize-none border bg-[#c9920a]/[0.03] px-4 py-3 font-sans text-sm text-[#f0e8d8] placeholder:font-serif placeholder:italic placeholder:text-[#f0e8d8]/50 focus:border-[#c9920a]/40 focus:bg-[#c9920a]/[0.05] focus:outline-none focus:ring-2 focus:ring-[#c9920a]/20 ${
                      fieldErrors.message
                        ? "border-red-400/60"
                        : "border-[#c9920a]/20"
                    }`}
                    required
                    aria-required="true"
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={
                      fieldErrors.message ? "contact-message-error" : undefined
                    }
                    onChange={() =>
                      setFieldErrors((prev) => ({
                        ...prev,
                        message: undefined,
                      }))
                    }
                  />
                  {fieldErrors.message && (
                    <span
                      id="contact-message-error"
                      className="font-sans text-xs text-red-300"
                      role="alert"
                    >
                      {fieldErrors.message}
                    </span>
                  )}
                </div>
                {status === "success" && (
                  <p
                    className="border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 font-sans text-sm text-emerald-200"
                    role="status"
                  >
                    Poruka je uspešno poslata. Javićemo vam se uskoro.
                  </p>
                )}
                {status === "error" && errorMessage && (
                  <p
                    className="border border-red-400/30 bg-red-500/10 px-4 py-3 font-sans text-sm text-red-200"
                    role="alert"
                  >
                    {errorMessage}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative w-full overflow-hidden bg-[#c9920a] px-5 py-3 font-sans text-sm font-bold uppercase tracking-[0.22em] text-[#0a0805] transition-colors hover:bg-[#d9a31f] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:animate-none animate-[fadeInUp_900ms_cubic-bezier(0.22,1,0.36,1)_both] [animation-delay:520ms]"
                >
                  <span
                    className="pointer-events-none absolute inset-y-0 left-[-35%] w-[30%] -skew-x-12 bg-white/30 blur-[1px] transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">
                    {status === "sending" ? "Šaljem…" : "POŠALJITE PORUKU"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
