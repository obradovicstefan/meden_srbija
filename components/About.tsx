import Image from "next/image";
import RevealOnScroll from "./RevealOnScroll";

export default function About() {
  return (
    <section
      id="o-nama"
      className="border-t border-white/10 bg-[var(--background)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-title"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="reveal-about">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="reveal-about-text order-2 space-y-6 lg:order-1">
              <h2
                id="about-title"
                className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl"
              >
                O nama
              </h2>
              <p className="text-lg leading-relaxed text-[var(--foreground)]/85 sm:text-xl">
                Meden Srbija nastoji da vam pruži autentičan med i proizvode od
                meda u kojima se oseća tradicija i pažnja prema kvalitetu.
                Verujemo u prirodne sastojke, odgovorno pčelarstvo i
                dugogodišnju posvećenost zanatu koji prenosi generacijama.
              </p>
              <p className="text-base leading-relaxed text-[var(--foreground)]/70 sm:text-lg">
                Svaki proizvod nosi istinu o poreklu i ručnom radu — od
                livadskog i šumskog meda do specijalnih kreacija. Zato se kod
                nas kvalitet nikad ne žrtvuje za količinu.
              </p>
            </div>
            <div className="reveal-about-image relative order-1 aspect-[4/3] overflow-hidden rounded-lg lg:order-2 lg:aspect-[3/4]">
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

        <RevealOnScroll className="reveal-timeline">
          <div className="max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24">
            <h3 className="reveal-timeline-title mb-12 text-center text-3xl font-semibold text-[var(--foreground)] sm:mb-14 sm:text-4xl">
              Tim koji stoji iza projekta
            </h3>
            <div className="space-y-10 sm:space-y-12">
              {/* Horizontal timeline: avatars aligned above their text columns */}
              <div className="reveal-timeline-avatars relative grid grid-cols-2 items-center gap-8 sm:gap-12">
                <div
                  className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-amber-400/30 via-amber-500/50 to-amber-600/30"
                  aria-hidden
                />
                <div className="relative z-10 flex justify-center">
                  <div className="h-32 w-32 overflow-hidden rounded-full ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[var(--background)] shadow-[0_0_24px_rgba(251,191,36,0.18)] sm:h-[9.25rem] sm:w-[9.25rem]">
                    <Image
                      src="/images/aboutus/osnivac.webp"
                      alt="Osnivač Meden Srbija"
                      width={296}
                      height={296}
                      quality={90}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 640px) 128px, 148px"
                    />
                  </div>
                </div>
                <div className="relative z-10 flex justify-center">
                  <div className="h-32 w-32 overflow-hidden rounded-full ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[var(--background)] shadow-[0_0_24px_rgba(251,191,36,0.18)] sm:h-[9.25rem] sm:w-[9.25rem]">
                    <Image
                      src="/images/aboutus/menadzer.webp"
                      alt="Menadžer Meden Srbija"
                      width={296}
                      height={296}
                      quality={90}
                      className="h-full w-full object-cover"
                      sizes="(max-width: 640px) 128px, 148px"
                    />
                  </div>
                </div>
              </div>
              {/* Text below each avatar: left Bojan, right Bogdan */}
              <div className="reveal-timeline-text grid grid-cols-2 gap-8 sm:gap-12">
                <div className="space-y-1.5 text-center">
                  <p className="text-sm font-medium uppercase tracking-widest text-amber-400/90">
                    Osnivač
                  </p>
                  <h4 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                    Bojan Stanković
                  </h4>
                  <p className="text-base leading-relaxed text-[var(--foreground)]/60">
                    Osnivač gazdinstva
                  </p>
                </div>
                <div className="space-y-1.5 text-center">
                  <p className="text-sm font-medium uppercase tracking-widest text-amber-400/90">
                    Menadžer
                  </p>
                  <h4 className="text-2xl font-semibold text-[var(--foreground)] sm:text-3xl">
                    Bogdan Stanković
                  </h4>
                  <p className="text-base leading-relaxed text-[var(--foreground)]/60">
                    Ideja i vizija brenda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
