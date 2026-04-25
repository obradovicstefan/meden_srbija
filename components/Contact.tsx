"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Mail, MapPin, Phone, Truck } from "lucide-react";
import { PublicErrorCode } from "@/lib/public-error-codes";

const PHONE_BOGDAN = "064 974 5589";
const PHONE_BOGDAN_HREF = "tel:+381649745589";
const PHONE_BOJAN = "062 119 8196";
const PHONE_BOJAN_HREF = "tel:+381621198196";
const EMAIL = "office@medensrbija.com";
const EMAIL_HREF = "mailto:office@medensrbija.com";
const LOCATION = "Beograd, Srbija";

/** Usklađeno sa app/api/send/route.ts */
const MAX_FULL_NAME_LEN = 200;
const MAX_MESSAGE_LEN = 5000;
const MIN_MESSAGE_LEN = 10;
const MAX_PHONE_LEN = 40;

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

/** Ujednačena poruka sa serverom za generičke greške slanja. */
const GENERIC_SUBMIT_ERROR =
  "Slanje poruke trenutno nije moguće. Pokušajte ponovo kasnije.";

/** Back off only for overload / transport — not for client-fixable or trust failures. */
function shouldApplySubmitBackoff(code: string | undefined): boolean {
  if (code === PublicErrorCode.VALIDATION) return false;
  if (code === PublicErrorCode.TURNSTILE_FAILED) return false;
  if (code === PublicErrorCode.BAD_REQUEST) return false;
  return true;
}

/** Eksponencijalno povećanje pauze između pokušaja (sekunde), max 120. */
function backoffSecondsForStreak(streak: number): number {
  if (streak <= 0) return 0;
  return Math.min(120, 2 ** Math.min(6, streak));
}

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
    subtext: "Bogdan & Bojan · Pon–Pet 08–20h",
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
  turnstile?: string;
};

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function Contact() {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const turnstileTokenRef = useRef<string | null>(null);
  /** Epoch ms when the form became ready (anti-automation: instant POSTs fail server-side). */
  const formOpenedAtRef = useRef<number>(0);
  /** Uzastopne greške slanja (ne računa validaciju / Turnstile). */
  const submitFailureStreakRef = useRef(0);
  /** Ne šalji ponovo pre ovog trenutka (eksponencijalni backoff + Retry-After). */
  const submitCooldownUntilRef = useRef(0);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleTurnstileSuccess = useCallback(
    (token: string) => {
      if (status === "sending") return;
      turnstileTokenRef.current = token;
      setFieldErrors((prev) => ({ ...prev, turnstile: undefined }));
    },
    [status],
  );

  const handleTurnstileExpire = useCallback(() => {
    if (status === "sending") return;
    turnstileTokenRef.current = null;
  }, [status]);

  const resetTurnstile = useCallback(() => {
    turnstileTokenRef.current = null;
    turnstileRef.current?.reset();
  }, []);

  useEffect(() => {
    formOpenedAtRef.current = Date.now();
  }, []);

  function validateFields(
    name: string,
    surname: string,
    email: string,
    message: string,
  ): FieldErrors {
    const err: FieldErrors = {};
    if (!name.trim()) err.name = "Unesite ime.";
    if (!surname.trim()) err.surname = "Unesite prezime.";
    const fullName = `${name.trim()} ${surname.trim()}`.trim();
    if (fullName.length > MAX_FULL_NAME_LEN) {
      err.name = `Ime i prezime zajedno najviše ${MAX_FULL_NAME_LEN} karaktera.`;
    }
    if (!email.trim()) err.email = "Unesite e-poštu.";
    else if (!validateEmail(email)) err.email = "Unesite ispravnu e-poštu.";
    const msg = message.trim();
    if (!msg) err.message = "Unesite poruku.";
    else if (msg.length < MIN_MESSAGE_LEN) {
      err.message = `Poruka mora imati najmanje ${MIN_MESSAGE_LEN} karaktera.`;
    } else if (msg.length > MAX_MESSAGE_LEN) {
      err.message = "Poruka je predugačka.";
    }
    return err;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const nameValue = String(formData.get("name") ?? "");
    const surname = String(formData.get("surname") ?? "");
    const email = String(formData.get("email") ?? "");
    const message = String(formData.get("message") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const honeypot = String(formData.get("company_website") ?? "");
    const name = `${nameValue.trim()} ${surname.trim()}`.trim();
    const tokenSnapshot = turnstileTokenRef.current;

    const errors = validateFields(nameValue, surname, email, message);
    if (TURNSTILE_SITE_KEY && !tokenSnapshot) {
      errors.turnstile = "Potvrdite sigurnosnu proveru ispod.";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const cooldownLeft = submitCooldownUntilRef.current - Date.now();
    if (cooldownLeft > 0) {
      const sec = Math.max(1, Math.ceil(cooldownLeft / 1000));
      setStatus("error");
      setErrorMessage(
        `Sačekajte još ${sec} s pre ponovnog slanja (duže pauze pomažu ako se problem ponavlja).`,
      );
      return;
    }

    setFieldErrors({});
    setStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          companyWebsite: honeypot,
          formOpenedAt: formOpenedAtRef.current,
          ...(TURNSTILE_SITE_KEY && tokenSnapshot
            ? { turnstileToken: tokenSnapshot }
            : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
      };

      if (!res.ok) {
        setStatus("error");
        if (data.code === PublicErrorCode.TURNSTILE_FAILED) {
          resetTurnstile();
          setErrorMessage(
            typeof data.error === "string"
              ? data.error
              : "Sigurnosna provera nije uspela. Pokušajte ponovo.",
          );
          return;
        }
        if (
          res.status === 429 ||
          data.code === PublicErrorCode.RATE_LIMIT
        ) {
          const base =
            typeof data.error === "string"
              ? data.error
              : "Previše zahteva. Sačekajte pa pokušajte ponovo.";
          const retryRaw = res.headers.get("Retry-After");
          const sec = retryRaw ? parseInt(retryRaw, 10) : NaN;
          let line = base;
          if (!Number.isNaN(sec) && sec > 0) {
            const mins = Math.max(1, Math.ceil(sec / 60));
            line = `${base} Pokušajte ponovo za oko ${mins} min.`;
          }
          if (shouldApplySubmitBackoff(data.code)) {
            submitFailureStreakRef.current += 1;
            const exp = backoffSecondsForStreak(submitFailureStreakRef.current);
            const waitSec =
              Number.isFinite(sec) && sec > 0 ? Math.max(sec, exp) : exp;
            submitCooldownUntilRef.current = Date.now() + waitSec * 1000;
            line = `${line} Ako se ovo ponavlja, sačekajte duže između pokušaja (npr. ${waitSec} s pa još duže).`;
          }
          setErrorMessage(line);
          return;
        }

        const serverGeneric =
          data.code === PublicErrorCode.UPSTREAM_FAILED ||
          data.code === PublicErrorCode.INTERNAL ||
          data.code === PublicErrorCode.SERVICE_UNAVAILABLE;

        let line: string;
        if (serverGeneric) {
          line = GENERIC_SUBMIT_ERROR;
        } else if (typeof data.error === "string" && data.error.length > 0) {
          line = data.error;
        } else {
          line = GENERIC_SUBMIT_ERROR;
        }

        if (shouldApplySubmitBackoff(data.code)) {
          submitFailureStreakRef.current += 1;
          const exp = backoffSecondsForStreak(submitFailureStreakRef.current);
          const retryRaw = res.headers.get("Retry-After");
          const srv = retryRaw ? parseInt(retryRaw, 10) : NaN;
          const waitSec =
            Number.isFinite(srv) && srv > 0 ? Math.max(srv, exp) : exp;
          submitCooldownUntilRef.current = Date.now() + waitSec * 1000;
          line = `${line} Pre sledećeg pokušaja sačekajte najmanje ${waitSec} s.`;
        }

        setErrorMessage(line);
        return;
      }
      setStatus("success");
      setFieldErrors({});
      resetTurnstile();
      submitFailureStreakRef.current = 0;
      submitCooldownUntilRef.current = 0;
      formOpenedAtRef.current = Date.now();
      form.reset();
    } catch {
      setStatus("error");
      submitFailureStreakRef.current += 1;
      const exp = backoffSecondsForStreak(submitFailureStreakRef.current);
      submitCooldownUntilRef.current = Date.now() + exp * 1000;
      setErrorMessage(
        `${GENERIC_SUBMIT_ERROR} Proverite konekciju. Pre sledećeg pokušaja sačekajte najmanje ${exp} s.`,
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
              aria-busy={status === "sending"}
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
                {/* Honeypot: hidden from users; bots often fill URL/company fields. */}
                <div
                  className="pointer-events-none absolute -left-[10000px] top-0 h-0 w-0 overflow-hidden opacity-0"
                  aria-hidden="true"
                >
                  <label htmlFor="contact-company-website">
                    Company website
                  </label>
                  <input
                    type="text"
                    id="contact-company-website"
                    name="company_website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

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
                      maxLength={MAX_FULL_NAME_LEN}
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
                      maxLength={MAX_FULL_NAME_LEN}
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
                    maxLength={MAX_PHONE_LEN}
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
                    minLength={MIN_MESSAGE_LEN}
                    maxLength={MAX_MESSAGE_LEN}
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
                {TURNSTILE_SITE_KEY ? (
                  <div className="space-y-2">
                    <p className="font-sans text-xs text-[#f0e8d8]/70">
                      Sigurnosna provera
                    </p>
                    <div
                      className={`flex min-h-[65px] items-center justify-center rounded border bg-[#c9920a]/[0.03] px-2 py-3 ${
                        fieldErrors.turnstile
                          ? "border-red-400/60"
                          : "border-[#c9920a]/20"
                      }`}
                    >
                      <Turnstile
                        ref={turnstileRef}
                        siteKey={TURNSTILE_SITE_KEY}
                        onSuccess={handleTurnstileSuccess}
                        onExpire={handleTurnstileExpire}
                        onError={() => {
                          if (status === "sending") return;
                          turnstileTokenRef.current = null;
                        }}
                        options={{
                          theme: "dark",
                          language: "sr",
                        }}
                      />
                    </div>
                    {fieldErrors.turnstile ? (
                      <span
                        className="font-sans text-xs text-red-300"
                        role="alert"
                      >
                        {fieldErrors.turnstile}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div aria-live="polite" className="space-y-3">
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
                </div>
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
