import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tracks from "@/components/Tracks";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import InstituteCallout from "@/components/InstituteCallout";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ParticleCursor from "@/components/ParticleCursor";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Global chrome */}
      <ScrollProgress />
      <ParticleCursor />

      {/* Navigation */}
      <Navbar />

      {/* Page content */}
      <main className="flex-grow">
        <Hero />
        <Tracks />
        <Process />
        <Testimonials />
        <Pricing />
        <InstituteCallout />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
