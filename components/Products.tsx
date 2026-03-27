"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import type { Product } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import RevealOnScroll from "@/components/RevealOnScroll";

const featuredProduct: Product = {
  id: "kesica",
  name: "Kesica",
  description: "", // Rendered with custom styling in featured block
  image: "/images/products/meden-bottle.webp",
  weightVariants: "",
};

/* Kesica colors: #fde74c (accent), #618b25 (PRIRODE), #ffbf00 (body) */

const products: Product[] = [
  {
    id: "bagrem",
    name: "Bagrem",
    description:
      "Delikatni med od bagremovog cveća, blagog ukusa i svetlije boje.",
    image: "/images/products/BAGREM.webp",
    weightVariants: "300 g – 500 RSD / 500 g – 900 RSD / 1 kg – 1.800 RSD",
    longDescription:
      "Karakteriše ga blag ukus, prijatna nežna aroma meda bogata vitaminom C.\n\nBagremov med u odnosu na druge vrste meda u sebi sadrži manje količine polena, što ne umanjuje njegove benefite, te je odličan za ljude sa alergijama na određene vrste polena.\n\nSvojim sastavom deluje opuštajuće na organizam.",
  },
  {
    id: "lipa",
    name: "Lipa",
    description: "Aromatičan med od lipe, pogodan za opuštanje i miran san.",
    image: "/images/products/LIPA.webp",
    weightVariants: "300 g – 500 RSD / 500 g – 850 RSD / 1 kg – 1.700 RSD",
    longDescription:
      "Karakteriše ga miris cveta lipe, oštrijeg je ukusa i intenzivnije arome meda. Sadrži visoku koncentraciju proteina, vitamina i amino kiselina koju ne možemo pronaći ni u jednoj drugoj vrsti meda.\n\nLekovita svojstva cveta lipe se prenose u potpunosti na sam med zbog čega ne gubi svoju delotvornost.\n\nMed lipe ima jaka antiinflamatorna i antioksidativna svojstva te je odličan za umirivanje nervnog sistema.",
  },
  {
    id: "sumski",
    name: "Šumski",
    description: "Tamniji med od šumskog medljika, intenzivnog ukusa.",
    image: "/images/products/SUMSKI.webp",
    weightVariants: "300 g – 560 RSD / 500 g – 1.000 RSD / 1 kg – 2.000 RSD",
    longDescription:
      "Karakteriše ga tamnija boja, oštar ukus i visoke koncentracije minerala, vitamina i oligosaharida.\n\nOLIGOSAHARID je sastojak u ovom medu koji intenzivno utiče na povećanje dobrih bakterija u digestivnom traktu.\n\nU narodu poznat kao „Hrana i lek” zbog svog visoko delotvornog sastava na celokupni organizam.\n\nPoseduje antiinflamatorna i antibakterijska svojstva zbog čega se preporučuje trudnicama i deci u razvoju.",
  },
  {
    id: "sace",
    name: "Med sa saćem",
    description:
      "Med u prirodnom saću, nefiltrovan i u potpunosti prirodan. Saće + med po želji.",
    image: "/images/products/SACE.webp",
    weightVariants: "700 RSD + med po želji",
    longDescription:
      "Karakteriše ga prisustvo pčelinjeg voska, poznatijeg kao SAĆE u kom se prirodno odvija proces stvaranja meda.\n\nPrisustvo saća sa sobom nosi apsorbovane aromatične komponente iz meda, zbog čega ima prijatan karakterističan miris košnice.\n\nIzuzetno je koristan za oblaganje sluzokože disajnih puteva i digestivnog trakta, zbog čega se preporučuje pušačima i osobama sa respiratornim oboljenjima, kao i osobama koje imaju probleme sa varenjem.\n\nMed sa saćem može biti u kombinaciji sa bilo kojim medom koji vi odaberete.",
  },
  {
    id: "livada",
    name: "Livadski",
    description: "Mešoviti livadski med, bogat polenskim izvorima i ukusom.",
    image: "/images/products/LIVADA.webp",
    weightVariants: "300 g – 450 RSD / 500 g – 800 RSD / 1 kg – 1.600 RSD",
    longDescription:
      "Karakteriše ga žućkasta do tamnocrvena boja, ukus i aroma variraju u zavisnosti koja biljna vrsta preovlađuje u medu.\n\nZbog velikog broja različitog nektara iz biljaka on sa sobom nosi i širok spektar delotvornosti na naš organizam.\n\nUglavnom se koristi kao pomoćno sredstvo u lečenju stomačnih, plućnih, bubrežnih oboljenja, kao i bolesti srca i krvnih sudova.\n\nVelikim i različitim prisustvom polena, osobe sa alergijama treba da obrate pažnju prilikom konzumiranja ovog meda.",
  },
  {
    id: "imuno1",
    name: "Imuno 1",
    description: "Med obogaćen prirodnim sastojcima za podršku imunitetu.",
    image: "/images/products/IMUNO1.webp",
    weightVariants: "2.500 RSD / 1 kg",
    longDescription:
      "Kombinacija meda sa jednim od najzdravijih pčelinjih proizvoda - matičnim mlečom.\n\nPrisutna je visoka koncentracija kompleksa vitamina B i neophodnih minerala za ljudski organizam.\n\nSpajanjem ova dva sastojka u jedan nam daje savršenu kombinaciju jer se međusobno podudaraju i podižu svoju efikasnost.\n\nMed pomaže da matična mleč uđe u krvotok velikom brzinom što proizvod čini vrlo efikasnim za poboljšavanje cirkulacije, jačanje nervnog sistema, psihičkog stanja i raspoloženja.\n\nPreporučuje se osobama sa: anksioznošću, depresijom, migrenama, nesanicama, kardiovaskularnim problemima, odlično se pokazao i kod poboljšanja kvaliteta kože, kao i mnoge druge benefite za organizam.\n\nProizvod može biti u kombinaciji sa medom po vašem izboru.",
  },
  {
    id: "imuno2",
    name: "Imuno 2",
    description: "Druga varijanta Imuno serije za jačanje odbrane organizma.",
    image: "/images/products/IMUNO2.webp",
    weightVariants: "3.600 RSD / 1 kg",
    longDescription:
      "Kombinacija prirodnog meda, matične mleči, polena i perge.\n\nKao i kod Imuno I, ova kombinacija je pojačana jer u sebi sadrži preostala dva najbitnija pčelinja proizvoda.\n\nMed kao sastojak ima mogućnost brzog apsorbovanja u organizam što ga čini odličnim prenosiocem potrebnih vitamina i minerala.\n\nKombinacija matične mleči, perge i polena međusobno stvaraju savršenu vezu i u organizmu podstiču veliku odbranu na virusne i bakterijske infekcije.\n\nPravilnom primenom se pokazao odlično u rešavanju ginekoloških oboljenja i oboljenja disajnih puteva.\n\nPreporučuje se osobama sa oslabljenim imunim sistemom koji je sklon čestim reinfekcijama.\n\nProizvod može biti u kombinaciji sa medom po vašem izboru.",
  },
  {
    id: "imuno3",
    name: "Imuno 3",
    description: "Treća varijanta Imuno linije, prirodna podrška imunitetu.",
    image: "/images/products/IMUNO3.webp",
    weightVariants: "2.300 RSD / 1 kg",
    longDescription:
      "Kombinacija meda sa lekovitim biljem.\n\nPomoću visoke koncentracije prirodnih sastojaka (biljaka) odličan je kod rešavanja disajnih problema, kao što je bronhitis i astma.\n\nBiljke iz meda povoljno utiču na digestivni trakt i normalizaciju crevne flore.\n\nPokazao je i veliki učinak kao prirodni antistres preparat.\n\nPreporučuje se osobama sa čestim infekcijama disajnih puteva, kao i čestim stomačnim problemima.\n\nProizvod može biti u kombinaciji sa medom po vašem izboru.",
  },
  {
    id: "grlo",
    name: "Sprej za grlo",
    description: "Prirodni sprej za negu grla i disajnih puteva.",
    image: "/images/products/GRLO.webp",
    weightVariants: "800 RSD / 30 ml",
    longDescription:
      "Sprej za grlo na bazi žalfije, rtanjskog čaja, majčine dušice i propolisa.\n\nU kombinaciji sa žalfijom i propolisom ovaj proizvod pruža antibakterijsko, antigljivično, antiseptičko i antiinflamatorno dejstvo.\n\nUPOTREBA: Tri do četiri puta dnevno prsnuti jednu do dve doze u grlo.\n\nSastav: Salvia officinalis, Satureja montana, Thymus serpyllum, Propolis.",
  },
  {
    id: "nos",
    name: "Sprej za nos",
    description: "Prirodna podrška za disajne puteve i slobodno disanje.",
    image: "/images/products/NOS.webp",
    weightVariants: "900 RSD / 30 ml",
    longDescription:
      "Sprej za nos sadrži kombinaciju 6 lekovitih bilja u kombinaciji sa srebrnom vodom i eukaliptusom.\n\nPovoljno utiče na sluzokožu nosa, pomoću prirodnih sastojaka brzo uklanja simptome zapušenog nosa i pruža osećaj svežine i hlađenja.\n\nSprej ima antiinflamatorna, antivirusna i antibakterijska svojstva.",
  },
  {
    id: "propolis",
    name: "Propolis",
    description: "Propolis u kombinaciji sa medom, prirodna zaštita organizma.",
    image: "/images/products/PROPOLIS.webp",
    weightVariants: "900 RSD / 30 ml",
    longDescription:
      "Poznat kao i „Pčelinji lepak” je jedan od najzdravijih darova koje dobijamo od pčela.\n\nPropolis pored toga što je izuzetno zdrav za celokupni organizam, on ima jako antiseptičko, antiinflamatorno, antifungalno i antibakterijsko dejstvo, koje je i naučno dokazano.\n\nUpotreba: Primenjuje se lokalno i oralno, preporučuje se i kao preventiva za ojačavanje imunog sistema, jer u sebi sadrži pored vitamina i jako bitne minerale za naš organizam.",
  },
  {
    id: "vanila",
    name: "Aromel Vanilla Madre",
    description: "Med sa prirodnom vanilom, blago slatkast i aromatičan.",
    image: "/images/products/Vanila.webp",
    weightVariants: "300 g – 520 RSD / 500 g – 930 RSD / 1 kg – 2.000 RSD",
    longDescription:
      "Vanila i badem\n\nU spoju toplog mirisa vanile i delikatne note badema, nastaje med koji odiše elegancijom i blagom slatkoćom. Aromel Vanilla Madre je stvoren za trenutke opuštanja - idealan uz jutarnju granolu, popodnevni čaj ili kao dodatak finim kolačima.\n\nIako obogaćen aromama, ovaj med zadržava sve prirodne nutritivne vrednosti. Sadrži enzime, antioksidanse i blagotvorne materije koje doprinose očuvanju zdravlja. Ne gubi svoja lekovita svojstva - već ih oplemenjuje kroz pažljivo izabrane prirodne sastojke.\n\nUživajte u desertnom ritualu koji ne traži kompromis između ukusa i koristi.",
  },
  {
    id: "citronis",
    name: "Aromel Citronis",
    description: "Med sa limunom i citrusnim notama, svež i blaže kiselo.",
    image: "/images/products/Citronis.webp",
    weightVariants: "300 g – 520 RSD / 500 g – 930 RSD / 1 kg – 2.000 RSD",
    longDescription:
      "Limeta i nana\n\nOsvježavajući, čist i drzak - Aromel Citronis spaja citrusnu notu limete sa divljom nanom koja osvežava dah i telo. Savršen je za letnje limunade, kao dodatak laganim salatama, uz sir ili kao prirodan tonik posle obroka.\n\nIako mu ukus pršti od intenziteta, ovaj med ostaje nefiltriran i neprekuvan - zadržava antiinflamatorna, antibakterijska i imunostimulativna svojstva bagremovog meda.\n\nTo je spoj koji ne razvodnjava snagu prirode, već je usmerava.",
  },
  {
    id: "wintera",
    name: "Aromel Wintera",
    description: "Zimska kreacija meda sa prirodnim sastojcima za imunitet.",
    image: "/images/products/Wintera.webp",
    weightVariants: "300 g – 520 RSD / 500 g – 930 RSD / 1 kg – 2.000 RSD",
    longDescription:
      "Narandža i cimet\n\nWintera je više od ukusa - to je doživljaj. Topla nota cimeta i voćna dubina narandže stapaju se sa prirodnim medom u harmoniju koja budi sećanja na porodične večeri, mirise praznika i sigurnost doma.\n\nOdlično se uklapa uz tople napitke, kaše, palačinke ili kao dodatak u zimskim slatkišima.\n\nIza svakog zalogaja krije se pun spektar benefita koje pruža čisti med - jer čak i u ovoj bogatoj kombinaciji, Aromel Wintera zadržava svoje hranljive i lekovite osobine.\n\nZa zimu koja ne hladi, već greje - iznutra.",
  },
  {
    id: "rakija",
    name: "Medna rakija",
    description: "Tradicionalna rakija sa dodatkom prirodnog meda.",
    image: "/images/products/Rakija.webp",
    weightVariants: "4.800 RSD / 700 ml",
    longDescription:
      "Zlato koje vlada\n\nOva rakija se rađa polako, ali snažno kao i priroda.\n\nTri godine odmara u mraku, sazreva i pretvara prirodnu snagu u tečnost neuporedive moći. Stvorena od meda, našeg najčistijeg, i oplemenjena lekovitim biljem.\n\nPosebno odabrano lekovito bilje, tako da svaka biljka ima svoju svrhu. Svaka kap nosi potpis zemlje, vetra i vatre.\n\nOna ne grize. Ona vlada. Mirisna kao planinsko jutro, teška kao reč predaka.\n\nPo porodičnoj recepturi, sačuvanoj i usavršavanoj generacijama, nastaje rakija koja se ne pije već poštuje.\n\nZa one koji znaju da prepoznaju suštinu. Za one koji biraju moć, a ne buku.\n\nOvo nije piće. Ovo je istorija pretočena u zlato.",
  },
];

function useIsMobile() {
  const query = "(max-width: 639px)";
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {};
      const m = window.matchMedia(query);
      m.addEventListener("change", onStoreChange);
      return () => m.removeEventListener("change", onStoreChange);
    },
    () =>
      typeof window === "undefined" ? false : window.matchMedia(query).matches,
    () => false,
  );
}

export default function Products() {
  const isMobile = useIsMobile();
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isCollapsingProducts, setIsCollapsingProducts] = useState(false);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const expandedOrAnimating = showAllProducts || isCollapsingProducts;
  const displayedProducts = expandedOrAnimating ? products : products.slice(0, 3);

  const handleToggleProducts = () => {
    if (!showAllProducts) {
      setShowAllProducts(true);
      return;
    }

    setHoveredProductId(null);
    const isMobileViewport = window.matchMedia("(max-width: 900px)").matches;

    if (isMobileViewport) {
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      setIsCollapsingProducts(true);
      window.setTimeout(() => {
        setShowAllProducts(false);
        setIsCollapsingProducts(false);
      }, 220);
      return;
    }

    setShowAllProducts(false);
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCardEnter = (product: Product, _rect: DOMRect) => {
    if (isMobile) return;

    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredProductId(product.id);
  };

  const handleCardLeave = () => {
    if (isMobile) return;
    leaveTimeoutRef.current = setTimeout(() => setHoveredProductId(null), 180);
  };

  return (
    <section
      ref={sectionRef}
      id="proizvodi"
      className="border-t border-white/10"
      aria-labelledby="products-title"
    >
      <RevealOnScroll once className="reveal-products">
        <div className="ms-products-header mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="reveal-products-heading ms-products-heading">
            <div className="ms-products-header-toprow" aria-hidden>
              <div className="ms-products-vertical-line" />
              <div className="ms-products-toplabel">Meden Srbija</div>
              <div className="ms-products-vertical-line" />
            </div>

            <h2 id="products-title" className="ms-products-title">
              PROIZVODI
            </h2>

            <div className="ms-products-divider" aria-hidden />
            <p className="ms-products-subtitle">
              Naši prirodni proizvodi od meda
            </p>
          </div>

          {/* Featured: JEDNA KESICA */}
          <div className="reveal-products-featured ms-animate-fadeup ms-products-featured-animate featured-card relative mx-auto max-w-[1200px]">
            <div className="featured-badge">IZDVOJENO</div>

            <div className="featured-card-grid">
              <div className="featured-img-pane">
                <div
                  className="ms-featured-image-wrap"
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
                <div className="featured-img-vignette" aria-hidden />
                <div className="featured-img-shimmer" aria-hidden />
              </div>

              <div className="featured-content">
                <div className="featured-prelabel">
                  <div className="featured-prelabel-line" aria-hidden />
                  <div className="featured-prelabel-text">
                    PRIRODNI PROIZVOD
                  </div>
                </div>

                <h3 className="featured-heading">GUTLJAJ DIVLJINE.</h3>
                <p className="featured-tagline ms-feat-tagline">
                  Jedan trenutak — koji traje duže.
                </p>

                <div className="featured-divider-thin" aria-hidden />

                <div className="featured-body ms-feat-body">
                  <p className="ms-feat-body-statement">
                    Više od dvadeset godina posvećenosti.
                  </p>

                  <div
                    className="featured-paragraph-separator ms-feat-body-divider"
                    aria-hidden
                  />

                  <ul className="ms-feat-tasting-notes">
                    <li>Šljivov destilat, sazrevan pet godina u hrastovim buradima</li>
                    <li>Planinski med i lekovito bilje sa planine Kukavice</li>
                  </ul>

                  <div
                    className="featured-paragraph-separator ms-feat-body-divider"
                    aria-hidden
                  />

                  <p className="ms-feat-body-intrigue">
                    U njoj je <strong>TAJNA</strong> porodice Stanković.
                  </p>

                  <p className="ms-feat-body-signature">
                    <span className="featured-brandname ms-brand">MEDEN</span> —
                    piće čiji ukus govori istoriju.
                  </p>
                </div>

                <div className="my-5 h-[3px] w-20 bg-[#c9920a]" aria-hidden />

                <a href="#kontakt" className="btn-primary">
                  Saznaj više
                </a>
              </div>
            </div>
          </div>

          <div className="reveal-products-grid">
            <div className="grid-header">
              <div className="grid-title">Sve vrste meda</div>
              <div className="grid-line" aria-hidden />
            </div>

            <div
              className="ms-grid"
              role="list"
              aria-labelledby="products-title"
            >
              {displayedProducts.map((product, index) => {
                const isExtra = index >= 3;
                const mobileExtraClass = isExtra
                  ? showAllProducts && !isCollapsingProducts
                    ? " ms-mobile-extra-enter"
                    : isCollapsingProducts
                      ? " ms-mobile-extra-exit"
                      : ""
                  : "";

                return (
                  <ProductCard
                    key={product.id}
                    className={`ms-animate-fadeup ms-products-card-animate${mobileExtraClass}`}
                  style={{
                    animationDelay: `${Math.min(0.1 + index * 0.1, 0.8)}s`,
                  }}
                  product={product}
                  onMouseEnter={
                    product.longDescription ? handleCardEnter : undefined
                  }
                  onMouseLeave={
                    product.longDescription ? handleCardLeave : undefined
                  }
                  isHovered={hoveredProductId === product.id}
                />
                );
              })}
            </div>

            {products.length > 3 && (
              <div className="products-toggle-wrap">
                <button
                  type="button"
                  className="products-toggle-btn"
                  onClick={handleToggleProducts}
                >
                  {showAllProducts
                    ? "Prikaži manje proizvoda"
                    : "Prikaži sve proizvode"}
                </button>
              </div>
            )}
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}
