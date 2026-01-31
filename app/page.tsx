import About from "@/components/About";
import Awards from "@/components/Awards";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import Products from "@/components/Products";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Products />
      <Awards />
      <Contact />
    </main>
  );
}
