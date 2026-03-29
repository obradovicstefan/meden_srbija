import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politika privatnosti | Meden Srbija",
  description:
    "Politika privatnosti sajta Meden Srbija — kako obrađujemo lične podatke pri kontaktu i upitima.",
};

const sections = [
  {
    title: "Ko smo mi",
    body: (
      <>
        Meden Srbija pruža informacije o medu i proizvodima od meda putem ovog veb sajta. Ova
        politika objašnjava kako postupamo sa podacima koje nam dostavite.
      </>
    ),
  },
  {
    title: "Koje podatke prikupljamo",
    body: (
      <>
        Kada nas kontaktirate putem forme na sajtu, možemo obraditi: ime i prezime, adresu
        e-pošte, broj telefona (ako ga navedete) i tekst poruke (uključujući narudžbine ili
        pitanja o proizvodima). Tehnički podaci mogu uključivati IP adresu i osnovne podatke o
        zahtevu radi zaštite od zloupotrebe (npr. ograničenje broja poruka), u skladu sa
        uobičajenom praksom hostinga.
      </>
    ),
  },
  {
    title: "Svrha i pravni osnov",
    body: (
      <>
        Podatke koristimo da odgovorimo na vaša pitanja, obradimo upite o narudžbinama i vodimo
        komunikaciju koju ste zatražili. Pravni osnov može biti izvršenje ugovora ili
        predugovornih mera, odnosno legitimni interes u odgovaranju na upite, u zavisnosti od
        situacije. Za detalje u vezi sa vašim pravima, obratite nam se na kontakt ispod.
      </>
    ),
  },
  {
    title: "Čuvanje i bezbednost",
    body: (
      <>
        Poruke se šalju elektronskom poštom preko pouzdanog pružaoca (npr. Resend). Ne
        objavljujemo sadržaj vaših poruka na sajtu. Rok čuvanja zavisi od poslovnih potreba i
        zakonskih obaveza (npr. knjigovodstvo); upite obično čuvamo onoliko dugo koliko je
        potrebno da obradimo zahtev i po potrebi u skladu sa zakonom.
      </>
    ),
  },
  {
    title: "Treće strane",
    body: (
      <>
        Hosting, isporuka e-pošte i sigurnosna provera forme (npr. Cloudflare Turnstile) mogu
        obrađivati tehničke podatke u svojim sistemima, u skladu sa njihovim politikama
        privatnosti. Biramo uobičajene pružaoce usluga radi funkcionalnosti i bezbednosti sajta.
      </>
    ),
  },
  {
    title: "Kolačići i analitika",
    body: (
      <>
        Ovaj sajt je koncipiran sa tamnom temom i minimalnim praćenjem. Ako u budućnosti uvedemo
        analitiku ili marketinške kolačiće, ažuriraćemo ovu stranicu i po potrebi zatražiti
        saglasnost u skladu sa važećim propisima.
      </>
    ),
  },
  {
    title: "Vaša prava",
    body: (
      <>
        U zavisnosti od primenjivog prava, možete imati pravo na uvid, ispravku, brisanje,
        ograničenje obrade, prigovor ili prenosivost podataka. Za zahteve u vezi sa ličnim
        podacima kontaktirajte nas na{" "}
        <a
          href="mailto:office@medensrbija.com"
          className="text-[#c9920a] underline decoration-[#c9920a]/40 underline-offset-2 transition-colors hover:text-[#d9a31f]"
        >
          office@medensrbija.com
        </a>
        .
      </>
    ),
  },
  {
    title: "Izmene",
    body: (
      <>Politiku možemo povremeno ažurirati. Značajne izmene će biti naznačene na ovoj stranici.</>
    ),
  },
];

export default function PolitikaPrivatnostiPage() {
  return (
    <main className="min-h-screen bg-[#0a0805]">
      <div className="mx-auto max-w-[720px] px-5 py-16 md:px-8 md:py-24">
        <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#c9920a]">
          Pravne informacije
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light leading-tight text-[#f0e8d8] md:text-5xl">
          Politika privatnosti
        </h1>
        <p className="mt-4 font-sans text-sm text-[#f0e8d8]/55">
          Poslednje ažuriranje: mart 2026.
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section, index) => (
            <section key={section.title} className="text-left">
              <h2 className="font-serif text-xl font-light text-[#f0e8d8] md:text-2xl">
                {index + 1}. {section.title}
              </h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#d1d1d1] md:text-base">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-white/[0.08] pt-8">
          <p className="font-sans text-xs leading-relaxed text-[#f0e8d8]/45">
            Ova stranica služi kao opšti informator i ne predstavlja pravni savet. Za konkretne
            situacije konsultujte stručnjaka.
          </p>
        </div>
      </div>
    </main>
  );
}
