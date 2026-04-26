import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import AboutSection from "@/components/sections/AboutSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <Products />
      <Awards />
      <Contact />
    </main>
  );
}
