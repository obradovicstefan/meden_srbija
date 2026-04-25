"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function MedenProductPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className={styles.pageRoot}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navBack}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="square"
            />
          </svg>
          Nazad
        </Link>
        <span className={styles.navRight}>Premijum Jako alkoholno piće</span>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroImagePanel}>
          <Image
            src="/images/products/bottle-in_depthV2.webp"
            alt="Meden proizvod"
            fill
            priority
            className={styles.heroImage}
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className={styles.heroTextPanel}>
          <div className={`${styles.lAccent} ${styles.tl}`} />
          <p className={styles.productCategory}>Istaknuti Proizvod · Est. 2008</p>
          <h1 className={styles.productTitle}>
            Meden
            <br />
            Potpis jedne tradicije
          </h1>
          <p className={styles.productSubtitle}>Stara šljiva, tiha legenda</p>
          <div className={styles.divider} />
          <p className={styles.productDescription}>
            Destilat šljive sa planine Goč, sazrevan minimum 5 godina u hrastu i oblikovan
            kroz tri generacije.
            <strong>
              Obogaćen medom i pažljivo odabranim biljem, piće u kom priroda ne prestaje da
              živi, već nastavlja da sazreva.
            </strong>
          </p>

          <div className={styles.specsRow}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Zapremina</span>
              <span className={styles.specValue}>700 ml</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Jačina</span>
              <span className={styles.specValue}>32,0% Vol.</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Odležavanje</span>
              <span className={styles.specValue}>5+ god.</span>
            </div>
          </div>

          <div className={styles.ctaRow}>
            <Link href="/#kontakt" className={styles.btnPrimary}>
              <span>Poruči sada</span>
            </Link>
            <a href="#story" className={styles.btnSecondary}>
              Saznaj više
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8H13M8 3L13 8L8 13"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="square"
                />
              </svg>
            </a>
          </div>

          <div className={`${styles.lAccent} ${styles.br}`} />
        </div>
      </section>

      <section className={styles.storySection} id="story">
        <div className={styles.reveal} data-reveal>
          <p className={styles.storyLabel}>Priča o Medenu</p>
          <h2 className={styles.storyHeading}>
            Tri generacije.
            <br />
            Jedna strast.
          </h2>
        </div>

        <div className={`${styles.storyBody} ${styles.reveal} ${styles.revealDelay1}`} data-reveal>
          <p>
            Sve je počelo tiho, nekoliko košnica u Medveđi i vera da se vrednost ne stvara
            brzo. Iz tog temelja nastala je filozofija koja se nije menjala.
          </p>
          <p>
            Poštovanje prema prirodi i vremenu postalo je osnova svega što danas nosi ime
            Meden.
          </p>
          <p>
            Bojan, kao naslednik, nije menjao pravac. Produbio ga je.
          </p>
          <blockquote className={styles.storyPullQuote}>
            &quot;Sve što čini Meden, nastaje polako i ostaje dugo.&quot;
          </blockquote>
          <p>
            Meden danas nosi potpis treće generacije, u kojoj se tradicija ne menja, već
            živi dalje.
          </p>
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={`${styles.processHeader} ${styles.reveal}`} data-reveal>
          <span className={styles.storyLabel}>PUT STVARANJA</span>
          <h2 className={styles.processHeading}>Od ploda do čaše</h2>
        </div>

        <div className={styles.processGrid}>
          <div className={`${styles.processStep} ${styles.reveal}`} data-reveal>
            <div className={styles.stepNumber}>01</div>
            <p className={styles.stepTitle}>Berba</p>
            <p className={styles.stepText}>
              Ručno birane šljive sorte Čačanska rodna i Čačanska lepotica, ubrane u
              trenutku njihove pune zrelosti.
            </p>
          </div>
          <div className={`${styles.processStep} ${styles.reveal} ${styles.revealDelay1}`} data-reveal>
            <div className={styles.stepNumber}>02</div>
            <p className={styles.stepTitle}>Fermentacija</p>
            <p className={styles.stepText}>
              Odabrane sorte šljive pretočene su u destilat kroz dvostruku frakcionu
              destilaciju, gde se izdvajaju samo najčistije i najplemenitije frakcije.
            </p>
          </div>
          <div className={`${styles.processStep} ${styles.reveal} ${styles.revealDelay2}`} data-reveal>
            <div className={styles.stepNumber}>03</div>
            <p className={styles.stepTitle}>Destilacija</p>
            <p className={styles.stepText}>
              Dvostruka frakciona destilacija, vođena iskustvom, u kojoj se pažljivo
              izdvajaju samo najčistije i najplemenitije frakcije.
            </p>
          </div>
          <div className={`${styles.processStep} ${styles.reveal} ${styles.revealDelay3}`} data-reveal>
            <div className={styles.stepNumber}>04</div>
            <p className={styles.stepTitle}>Odležavanje</p>
            <p className={styles.stepText}>
              Minimum 5 godina u buradima hrasta kitnjaka, gde destilat polako sazreva,
              razvijajući dubinu koju samo vreme može dati.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.detailsSection}>
        <div>
          <div className={styles.reveal} data-reveal>
            <p className={styles.storyLabel}>Degustacione Beleške</p>
            <h2 className={`${styles.storyHeading} ${styles.profileHeading}`}>Profil ukusa</h2>
          </div>

          <div className={styles.tastingNotes}>
            <div className={`${styles.noteCard} ${styles.reveal} ${styles.revealDelay1}`} data-reveal>
              <p className={styles.noteType}>Miris</p>
              <p className={styles.noteText}>
                Šljivov destilat prožet svežinom nane, uz disrektne biljne tonove koji
                nagoveštavaju složenost.
              </p>
            </div>
            <div className={`${styles.noteCard} ${styles.reveal} ${styles.revealDelay2}`} data-reveal>
              <p className={styles.noteType}>Ukus</p>
              <p className={styles.noteText}>
                Planinski med oblikuje punoću ukusa, dok biljne note, predvođene nanom,
                stvaraju njegov slojevit i prepoznatljiv karakter.
              </p>
            </div>
            <div className={`${styles.noteCard} ${styles.reveal} ${styles.revealDelay3}`} data-reveal>
              <p className={styles.noteType}>Završetak</p>
              <p className={styles.noteText}>
                Dug i topao završetak, u kojem se zadržava prirodna slatkoća meda, uz
                diskretnu svežinu biljnih tonova.
              </p>
            </div>
            <div className={`${styles.noteCard} ${styles.reveal} ${styles.revealDelay4}`} data-reveal>
              <p className={styles.noteType}>Serviranje</p>
              <p className={styles.noteText}>Na sobnoj temperaturi, ili blago rashlađeno na 14-16°C</p>
            </div>
          </div>
        </div>

        <div className={`${styles.productFacts} ${styles.reveal} ${styles.revealDelay1}`} data-reveal>
          <p className={styles.storyLabel}>Specifikacije</p>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Vrsta</span>
            <span className={styles.factVal}>Premium alkoholno piće</span>
          </div>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Poreklo</span>
            <span className={styles.factVal}>Južna Srbija</span>
          </div>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Alkohol</span>
            <span className={styles.factVal}>32,0% vol</span>
          </div>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Zapremina</span>
            <span className={styles.factVal}>700 ml</span>
          </div>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Odležano</span>
            <span className={styles.factVal}>5+ godina</span>
          </div>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Burad</span>
            <span className={styles.factVal}>Hrast kitnjak</span>
          </div>
          <div className={styles.factItem}>
            <span className={styles.factKey}>Serija</span>
            <span className={styles.factVal}>Batch proizvodnja</span>
          </div>
        </div>
      </section>

      <section className={styles.footerCta}>
        <span className={`${styles.storyLabel} ${styles.reveal}`} data-reveal>
          Dostupno sada
        </span>
        <h2 className={`${styles.footerCtaHeading} ${styles.reveal} ${styles.revealDelay1}`} data-reveal>
          Doživi Meden
          <br />
          Iskustvo koje traje duže od trenutka
        </h2>
        <p className={`${styles.footerCtaSub} ${styles.reveal} ${styles.revealDelay2}`} data-reveal>
          Direktna dostava na vašu adresu, uz pakovanje dostojno onoga što nosi
        </p>
        <div className={`${styles.reveal} ${styles.revealDelay3}`} data-reveal>
          <Link href="/#kontakt" className={`${styles.btnPrimary} ${styles.btnPrimaryLarge}`}>
            <span>Poruči odmah &nbsp;→</span>
          </Link>
        </div>
      </section>

      <footer className={styles.footerMini}>
        <span className={styles.footerMiniLogo}>
          Meden <span>Srbija</span>
        </span>
        <span className={styles.footerCopy}>© 2026 Meden Srbija · Sva prava zadržana</span>
      </footer>
    </main>
  );
}
