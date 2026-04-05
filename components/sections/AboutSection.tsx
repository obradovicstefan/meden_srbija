"use client";

import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import "./AboutSection.css";

function scrollToProducts() {
  const el = document.getElementById("proizvodi");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    return;
  }
  window.location.hash = "#proizvodi";
}

export default function AboutSection() {
  return (
    <section id="o-nama" aria-labelledby="about-title" className="aboutV4 pt-[72px] lg:pt-0">
      <RevealOnScroll className="reveal-about-v4" once>
        <div className="aboutV4Grid pt-[100px] sm:pt-[72px] max-sm:pt-[52px]">
          <div className="aboutV4Left">
            <p className="aboutV4Eyebrow">O nama</p>

            <h2 id="about-title" className="aboutV4Title">
              Meden Srbija
            </h2>

            <div className="aboutV4Underline" aria-hidden />

            <p className="aboutV4Paragraph aboutV4Paragraph1">
              <span className="aboutV4Brand">Meden Srbija</span> nastoji da vam pruži autentičan med i proizvode od
              meda u kojima se oseća tradicija i pažnja prema kvalitetu.
              Verujemo u prirodne sastojke, odgovorno pčelarstvo i dugogodišnju
              posvećenost zanatu koji prenosi generacijama.
            </p>

            <div className="aboutV4Divider" aria-hidden />

            <p className="aboutV4Paragraph aboutV4Paragraph2">
              Svaki proizvod nosi istinu o poreklu i ručnom radu — od livadskog
              i šumskog meda do specijalnih kreacija. Zato se kod nas kvalitet
              nikad ne žrtvuje za količinu.
            </p>

            <div className="aboutV4Stats" role="group" aria-label="Istaknute činjenice">
              <div className="aboutV4Stat">
                <div className="aboutV4StatNumber">18+</div>
                <div className="aboutV4StatLabel">Godina</div>
              </div>
              <div className="aboutV4Stat">
                <div className="aboutV4StatNumber">100%</div>
                <div className="aboutV4StatLabel">Prirodno</div>
              </div>
              <div className="aboutV4Stat aboutV4StatLast">
                <div className="aboutV4StatNumber">8</div>
                <div className="aboutV4StatLabel">Vrsta meda</div>
              </div>
            </div>

            <button type="button" className="aboutV4Button" onClick={scrollToProducts}>
              Saznaj više
            </button>
          </div>

          <div className="aboutV4Right">
            <div className="aboutV4CornerTL" aria-hidden />
            <div className="aboutV4CornerBR" aria-hidden />

            <div className="aboutV4PhotoWrap">
              <Image
                src="/images/aboutus/onama.webp"
                alt="Pčelar sa saćem"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <div className="aboutV4PhotoOverlay" aria-hidden />

              <div className="aboutV4Caption">
                <div className="aboutV4CaptionLeft">Ručni rad · Priroda · Tradicija</div>
                <div className="aboutV4CaptionTag">Est. 2008</div>
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>

      <div className="aboutV4DiamondDivider" aria-hidden>
        <div className="aboutV4DiamondLine" />
        <div className="aboutV4Diamond" />
        <div className="aboutV4DiamondLine" />
      </div>

      <RevealOnScroll className="reveal-about-family" once>
        <div className="aboutV4Family" aria-labelledby="about-family-title">
          <header className="aboutV4FamilyHeader">
            <p className="aboutV4FamilyEyebrow">Naša</p>
            <p className="aboutV4FamilyEyebrow aboutV4FamilyEyebrowMuted">Porodica</p>
            <h3 id="about-family-title" className="aboutV4FamilyTitle">
              Stanković
            </h3>
            <div className="aboutV4FamilyBar" aria-hidden />
          </header>

          <div className="aboutV4FamilyPortraits" role="list" aria-label="Generacije porodice Stanković">
            <article className="aboutV4FamilyPortrait aboutV4FamilyPortraitSide" role="listitem">
              <p className="aboutV4FamilyGeneration">I generacija</p>

              <div className="aboutV4FamilyAvatarWrap aboutV4FamilyAvatarWrapSide">
                <div className="aboutV4FamilyAvatarInner aboutV4FamilyAvatarInnerSide">
                  <span className="aboutV4FamilyInitials aboutV4FamilyInitialsSide" aria-hidden>
                    SS
                  </span>
                  <Image
                    src="/images/aboutus/Osnivac_tradicije.webp"
                    alt="Stojan Stanković"
                    width={136}
                    height={136}
                    sizes="(max-width: 639px) 136px, (max-width: 1023px) 120px, 136px"
                    className="aboutV4FamilyAvatarImg"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.parentElement?.querySelector(
                        ".aboutV4FamilyInitials",
                      ) as HTMLElement | null;
                      if (fallback) fallback.style.opacity = "1";
                    }}
                  />
                </div>
                <div className="aboutV4FamilyAvatarDot" aria-hidden />
              </div>

              <p className="aboutV4FamilyRole aboutV4FamilyRoleSide">Osnivač tradicije</p>
              <h4 className="aboutV4FamilyName aboutV4FamilyNameSide">Stojan Stanković</h4>
              <p className="aboutV4FamilyEra">Medveđa</p>
            </article>

            <div className="aboutV4FamilySeparator" aria-hidden />

            <article className="aboutV4FamilyPortrait aboutV4FamilyPortraitMain" role="listitem">
              <p className="aboutV4FamilyGeneration">II generacija</p>

              <div className="aboutV4FamilyAvatarWrap aboutV4FamilyAvatarWrapMain">
                <div className="aboutV4FamilyAvatarInner aboutV4FamilyAvatarInnerMain">
                  <span className="aboutV4FamilyInitials aboutV4FamilyInitialsMain" aria-hidden>
                    BS
                  </span>
                  <Image
                    src="/images/aboutus/Osnivac_gazdinstva.webp"
                    alt="Bojan Stanković"
                    width={176}
                    height={176}
                    sizes="(max-width: 639px) 136px, (max-width: 1023px) 152px, 176px"
                    className="aboutV4FamilyAvatarImg"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.parentElement?.querySelector(
                        ".aboutV4FamilyInitials",
                      ) as HTMLElement | null;
                      if (fallback) fallback.style.opacity = "1";
                    }}
                  />
                </div>
                <div className="aboutV4FamilyAvatarDot" aria-hidden />
              </div>

              <p className="aboutV4FamilyRole">Pčelar · Osnivač gazdinstva</p>
              <h4 className="aboutV4FamilyName">Bojan Stanković</h4>
              <p className="aboutV4FamilyEra">Est. 2008</p>
            </article>

            <div className="aboutV4FamilySeparator" aria-hidden />

            <article className="aboutV4FamilyPortrait aboutV4FamilyPortraitSide" role="listitem">
              <p className="aboutV4FamilyGeneration">III generacija</p>

              <div className="aboutV4FamilyAvatarWrap aboutV4FamilyAvatarWrapSide">
                <div className="aboutV4FamilyAvatarInner aboutV4FamilyAvatarInnerSide">
                  <span className="aboutV4FamilyInitials aboutV4FamilyInitialsSide" aria-hidden>
                    BS
                  </span>
                  <Image
                    src="/images/aboutus/menadzer.webp"
                    alt="Bogdan Stanković"
                    width={136}
                    height={136}
                    sizes="(max-width: 639px) 136px, (max-width: 1023px) 120px, 136px"
                    className="aboutV4FamilyAvatarImg"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      const fallback = event.currentTarget.parentElement?.querySelector(
                        ".aboutV4FamilyInitials",
                      ) as HTMLElement | null;
                      if (fallback) fallback.style.opacity = "1";
                    }}
                  />
                </div>
                <div className="aboutV4FamilyAvatarDot" aria-hidden />
              </div>

              <p className="aboutV4FamilyRole aboutV4FamilyRoleSide">Direktor · Meden</p>
              <h4 className="aboutV4FamilyName aboutV4FamilyNameSide">Bogdan Stanković</h4>
              <p className="aboutV4FamilyEra">Danas</p>
            </article>
          </div>

          <div className="aboutV4FamilyStory">
            <div className="aboutV4FamilyStoryLabelRow" aria-hidden>
              <p className="aboutV4FamilyStoryLabel">Naša priča</p>
              <div className="aboutV4FamilyStoryLine" />
            </div>

            <div className="aboutV4FamilyStoryBody">
              <p>
                <em>Meden je nastao iz porodične tradicije koja traje generacijama.</em>
              </p>
              <p>
                Na jugu Srbije, u okolini Leskovca, u mestu Medveđa, započela je priča o pčelarstvu, lekovitom bilju i
                dubokom poštovanju prema prirodi. Još tada, kroz rad i istraživanje <strong>Stojana</strong>, postavljeni
                su temelji znanja koje se danas prenosi i razvija.
              </p>
              <p>
                To nasleđe nastavlja <strong>Bojan</strong>, koji pre više od 15 godina pokreće sopstveno gazdinstvo i
                započinje ozbiljnu proizvodnju meda i pčelinjih proizvoda. Kroz godine rada, pčelinjaci se šire širom
                Srbije, prateći prirodne cikluse i najčistije izvore nektara — od livada do planina.
              </p>
              <p>
                Iz tog iskustva nastaje <strong>Meden</strong>. U njegovoj osnovi nalazi se pažljivo odležan šljivov
                destilat, koji se spaja sa prirodnim medom iz sopstvene proizvodnje i pažljivo biranim lekovitim biljem sa
                planine Kukavice. Svaki sastojak ima jasno poreklo, a svaki korak u procesu svoju svrhu.
              </p>
              <p>
                <em>
                  Meden nije rezultat ubrzane proizvodnje. On je rezultat vremena, znanja i doslednosti.
                </em>{" "}
                Danas predstavlja spoj tradicionalnog pčelarstva, poznavanja prirode i precizne izrade — proizvod iza kog
                stojimo imenom i iskustvom.
              </p>
            </div>

            <div className="aboutV4FamilyStoryUnderline" aria-hidden>
              <div className="aboutV4DiamondDivider">
                <div className="aboutV4DiamondLine" />
                <div className="aboutV4Diamond" />
                <div className="aboutV4DiamondLine" />
              </div>
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

