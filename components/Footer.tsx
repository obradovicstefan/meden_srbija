import Image from "next/image";
import Link from "next/link";

const currentYear = new Date().getFullYear();
const INSTAGRAM_URL = "https://www.instagram.com/medensrbija/";
const FACEBOOK_URL = "https://www.facebook.com/bogdan.stankovic.902/";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">Meden Srbija</p>
            <p className="mt-1 text-sm text-[var(--foreground)]/70">
              Tradicionalni med i proizvodi od meda. Kvalitet i tradicija.
            </p>
          </div>
          <div className="flex items-center gap-4" aria-label="Društvene mreže">
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
        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--foreground)]/60">
            © {currentYear} Meden Srbija. Sva prava zadržana.
          </p>
          <nav className="flex gap-6" aria-label="Podnožje">
            <Link href="#pocetna" className="text-xs text-[var(--foreground)]/60 hover:text-[var(--foreground)]">
              Početna
            </Link>
            <Link href="#kontakt" className="text-xs text-[var(--foreground)]/60 hover:text-[var(--foreground)]">
              Kontakt
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
