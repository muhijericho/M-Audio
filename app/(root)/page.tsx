// app/(root)/page.tsx
import Home from "@/app/(root)/components/Home";
import Services from "@/app/(root)/components/Services";
import About from "@/app/(root)/components/About";
import Contact from "@/app/(root)/components/Contact";

export default function LandingPage() {
  return (
    <>
      <section id="home">
        <Home />
      </section>

      <section id="services">
        <Services />
      </section>

      <section id="about">
        <About />
      </section>

      <section id="contact">
        <Contact />
      </section>
    </>
  );
}