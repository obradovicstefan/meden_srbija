import Image from "next/image";
import Link from "next/link";

const currentYear = new Date().getFullYear();
const INSTAGRAM_URL = "https://www.instagram.com/medensrbija/";
const FACEBOOK_URL = "https://www.facebook.com/bogdan.stankovic.902/";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <p className="text-[26px] font-semibold leading-snug tracking-tight text-[var(--foreground)] [font-family:var(--font-cormorant)]">
              Meden <span className="italic text-[#c9920a]">Srbija</span>
            </p>
            <p className="mt-1 text-[14px] text-[rgba(240,232,216,0.45)] [font-family:var(--font-montserrat)]">
              Tradicionalni med i proizvodi od meda. Kvalitet i tradicija.
            </p>
          </div>
          <div
            className="flex items-center justify-center gap-4 sm:justify-start"
            aria-label="Društvene mreže"
          >
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
              aria-label="Facebook"
            >
              <Image
                src="/images/socials/facebook.webp"
                alt=""
                width={28}
                height={28}
                className="object-contain"
                sizes="28px"
              />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-[var(--background)]"
              aria-label="Instagram"
            >
              <Image
                src="/images/socials/instagram.webp"
                alt=""
                width={28}
                height={28}
                className="object-contain"
                sizes="28px"
              />
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-[12px] text-[var(--foreground)]/60 [font-family:var(--font-montserrat)]">
            © {currentYear}{" "}
            <span className="text-[rgba(240,232,216,0.45)]">Meden Srbija</span>.
            Sva prava zadržana.
          </p>
          <nav
            className="flex justify-center gap-6 sm:justify-start"
            aria-label="Podnožje"
          >
            <Link
              href="#pocetna"
              className="text-xs text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
            >
              Početna
            </Link>
            <Link
              href="#kontakt"
              className="text-xs text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
            >
              Kontakt
            </Link>
            <Link
              href="/politika-privatnosti"
              className="text-xs text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
            >
              Politika privatnosti
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
