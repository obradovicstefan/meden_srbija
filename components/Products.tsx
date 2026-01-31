"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Product } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import ProductHoverPanel from "@/components/ProductHoverPanel";
import RevealOnScroll from "@/components/RevealOnScroll";

const featuredProduct: Product = {
  id: "kesica",
  name: "Kesica",
  description: "", // Rendered with custom styling in featured block
  image: "/images/products/KESICA.webp",
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

export default function Products() {
  const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCardEnter = (product: Product, rect: DOMRect) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setHoveredRect(rect);
    setHoveredProduct(product);
  };

  const handleCardLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => setHoveredProduct(null), 180);
  };

  const handlePanelEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handlePanelLeave = () => {
    setHoveredProduct(null);
    setHoveredRect(null);
  };

  return (
    <section
      id="proizvodi"
      className="border-t border-white/10 bg-[var(--background)] py-16 sm:py-20 lg:py-24"
      aria-labelledby="products-title"
    >
      <RevealOnScroll>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="products-title"
            className="mb-12 text-center text-3xl font-bold tracking-tight text-[var(--foreground)] sm:mb-16 sm:text-4xl lg:text-5xl"
          >
            Proizvodi
          </h2>

          {/* Featured: Kesica — animated background + hover jiggle */}
          <div className="featured-product-block group/featured relative mb-14 overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 via-transparent to-amber-500/5 shadow-xl shadow-amber-400/10 sm:mb-16">
            <div className="absolute right-4 top-4 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 sm:right-6 sm:top-6 sm:px-4 sm:py-1.5 sm:text-sm">
              Izdvojeno
            </div>
            <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
              <div className="relative order-2 aspect-square max-w-md overflow-hidden rounded-xl bg-black/30 lg:order-1 lg:max-w-none">
                <Image
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  fill
                  className="object-contain object-center p-8 transition-transform duration-300 ease-out group-hover/featured:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div
                  className="absolute inset-0 rounded-xl ring-2 ring-inset ring-amber-400/20"
                  aria-hidden
                />
              </div>
              <div className="order-1 flex flex-col justify-center space-y-4 lg:order-2 lg:space-y-6">
                <h3 className="text-3xl font-medium uppercase tracking-tight text-[#fde74c] sm:text-4xl lg:text-5xl">
                  Jedna kesica.
                </h3>
                <div className="space-y-4 text-base leading-loose text-[#ffbf00] sm:text-lg">
                  <p>
                    Sa ukusom{" "}
                    <span className="font-semibold uppercase italic text-[#618b25]">
                      prirode
                    </span>{" "}
                    i{" "}
                    <span className="font-semibold uppercase italic text-[#fde74c]">
                      luksuza
                    </span>
                    .
                  </p>
                  <p>
                    Crna površina govori tiho, zlatna slova nose poruku —{" "}
                    <span className="font-semibold uppercase text-[#fde74c]">
                      prestiž je tu.
                    </span>
                  </p>
                  <p>
                    U njoj je{" "}
                    <span className="font-semibold uppercase italic text-[#618b25]">
                      MOĆ PRIRODE
                    </span>
                    , upakovana za one koji znaju suštinu.
                  </p>
                  <p>
                    <span className="font-semibold uppercase text-[#fde74c]">
                      MEDEN
                    </span>{" "}
                    — tamo gde se luksuz ne pokazuje, već podrazumeva.
                  </p>
                </div>
                <div className="h-px w-16 bg-amber-400/50" aria-hidden />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onMouseEnter={
                  product.longDescription ? handleCardEnter : undefined
                }
                onMouseLeave={
                  product.longDescription ? handleCardLeave : undefined
                }
              />
            ))}
          </div>
          {hoveredProduct && hoveredRect && (
            <ProductHoverPanel
              product={hoveredProduct}
              anchorRect={hoveredRect}
              onMouseEnter={handlePanelEnter}
              onMouseLeave={handlePanelLeave}
            />
          )}
        </div>
      </RevealOnScroll>
    </section>
  );
}
