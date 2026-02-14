import Image from "next/image";
import ExpandableBio from "./ExpandableBio";
import RevealOnScroll from "./RevealOnScroll";

export default function About() {
  return (
    <section
      id="o-nama"
      className="border-t border-white/10 bg-[var(--background)] pt-[100px] pb-20 lg:pt-[120px] lg:pb-24"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="reveal-about">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal-about-text order-2 space-y-6 lg:order-1">
              <div>
                <h2
                  id="about-title"
                  className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-[48px]"
                >
                  O nama
                </h2>
                <div
                  className="mt-4 h-[3px] w-[70px] bg-[var(--gold)]"
                  aria-hidden
                />
              </div>
              <p className="text-lg leading-relaxed text-[var(--foreground)]/90 sm:text-xl sm:leading-[1.65]">
                Meden Srbija nastoji da vam pruži autentičan med i proizvode od
                meda u kojima se oseća tradicija i pažnja prema kvalitetu.
                Verujemo u prirodne sastojke, odgovorno pčelarstvo i
                dugogodišnju posvećenost zanatu koji prenosi generacijama.
              </p>
              <p className="text-base leading-relaxed text-[var(--foreground)]/80 sm:text-lg">
                Svaki proizvod nosi istinu o poreklu i ručnom radu — od
                livadskog i šumskog meda do specijalnih kreacija. Zato se kod
                nas kvalitet nikad ne žrtvuje za količinu.
              </p>
              <a
                href="#proizvodi"
                className="inline-block w-full rounded-lg border-2 border-amber-400/60 bg-transparent px-10 py-4 text-center text-base font-semibold text-amber-400/95 transition-all duration-300 ease-out hover:bg-amber-400/20 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto sm:px-12 sm:py-5 sm:text-lg"
              >
                Saznaj više
              </a>
            </div>
            <div className="reveal-about-image relative order-1 aspect-[4/3] overflow-hidden rounded-xl border-2 border-[var(--gold)]/30 shadow-[0_10px_40px_rgba(212,175,55,0.15),0_0_24px_rgba(212,175,55,0.06)] lg:order-2 lg:aspect-[3/4]">
              <Image
                src="/images/aboutus/onama.webp"
                alt="Meden Srbija – tradicija i kvalitet"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </RevealOnScroll>

        <div className="flex flex-col items-center pt-20 pb-8 lg:pt-[100px]" aria-hidden>
          <div className="h-px w-[70px] shrink-0 bg-[var(--gold)]/30" />
        </div>

        <RevealOnScroll className="reveal-timeline">
          <div className="mx-auto w-full max-w-[1200px] px-4 pt-[100px] pb-20 sm:px-6 md:pt-[110px] md:pb-24 lg:px-8 lg:pt-[120px] lg:pb-24">
            <div className="reveal-timeline-title mb-16 text-center lg:mb-20">
              <h3 id="team-title" className="text-[32px] font-bold text-[var(--foreground)] sm:text-4xl lg:text-5xl">
                Tim koji stoji iza projekta
              </h3>
              <div
                className="mx-auto mt-4 h-[3px] w-[70px] bg-[var(--gold)]"
                aria-hidden
              />
            </div>
            <div className="relative">
              <div className="reveal-timeline-avatars grid grid-cols-1 gap-[60px] md:gap-16 lg:grid-cols-2 lg:gap-24">
                <article className="reveal-team-left team-member-card flex flex-col items-center rounded-[14px] p-8 text-center outline-none md:p-10 lg:p-12">
                <div className="team-avatar h-[180px] w-[180px] overflow-hidden rounded-full lg:h-[220px] lg:w-[220px]">
                  <Image
                    src="/images/aboutus/osnivac.webp"
                    alt="Osnivač Meden Srbija – Bojan Stanković"
                    width={220}
                    height={220}
                    quality={90}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1023px) 180px, 220px"
                  />
                </div>
                <div className="mt-6 flex max-w-[320px] flex-col items-center text-center">
                  <p className="team-role-label mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)] sm:text-sm">
                    Osnivač
                  </p>
                  <h4 className="mb-2 text-2xl font-bold leading-tight text-[var(--foreground)] lg:text-3xl">
                    Bojan Stanković
                  </h4>
                  <ExpandableBio
                    previewCount={1}
                    paragraphs={[
                      "Osnivač gazdinstva koji je rođen u Beogradu 1981. godine.",
                      "Poljoprivredno gazdinstvo osnovao je 2008. godine kada je iza sebe već imao veliki broj godina provedenih u pčelinjacima širom Srbije kod tada najboljih pčelara.",
                      "Posvetivši svoj život pčelama dovelo je do toga da njegovi proizvodi budu nagrađeni u Srbiji i visoko plasirani u inostranstvu.",
                      'Med gazdinstva "Stanković" osvojio je sva tri mesta na medjunarodnom takmičenju u kvalitetu meda u Tuzli i Severnoj Makedoniji 2020. godine.',
                    ]}
                  />
                </div>
              </article>
              <div className="flex justify-center lg:hidden" aria-hidden>
                <div className="h-10 w-px shrink-0 bg-gradient-to-b from-transparent via-[var(--gold)]/50 to-transparent" />
              </div>
              <article className="reveal-team-right team-member-card flex flex-col items-center rounded-[14px] p-8 text-center outline-none md:p-10 lg:p-12">
                <div className="team-avatar h-[180px] w-[180px] overflow-hidden rounded-full lg:h-[220px] lg:w-[220px]">
                  <Image
                    src="/images/aboutus/menadzer.webp"
                    alt="Direktor Meden Srbija – Bogdan Stanković"
                    width={220}
                    height={220}
                    quality={90}
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1023px) 180px, 220px"
                  />
                </div>
                <div className="mt-6 flex max-w-[320px] flex-col items-center text-center">
                  <p className="team-role-label mb-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--gold)] sm:text-sm">
                    Direktor
                  </p>
                  <h4 className="mb-2 text-2xl font-bold leading-tight text-[var(--foreground)] lg:text-3xl">
                    Bogdan Stanković
                  </h4>
                  <ExpandableBio
                    previewCount={1}
                    paragraphs={[
                      "Sin Bojana Stankovića, od svog detinjstva prati posao svog oca.",
                      "Odlučuje da mu se pridruži i pomogne u svetu digitalnog marketinga, kao i u plasiranju proizvoda na online platforme.",
                      "Bogdan izvršava posao direktora i tu je da vam pruži sve neophodne informacije o nama i našim uslugama.",
                    ]}
                  />
                </div>
              </article>
            </div>
            <div className="team-connecting-line hidden lg:block" aria-hidden />
          </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
