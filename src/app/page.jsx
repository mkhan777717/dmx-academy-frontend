import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Tracks from "@/components/Tracks";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import CinematicCursor from "@/components/CinematicCursor";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Global chrome */}
      <ScrollProgress />
      <CinematicCursor />

      {/* Navigation */}
      <Navbar />

      {/* Page content */}
      <main className="flex-grow">
        <Hero />
        <Tracks />
        <Process />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
