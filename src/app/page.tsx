import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhatWeCheck from "@/components/landing/WhatWeCheck";
import SampleReport from "@/components/landing/SampleReport";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <WhatWeCheck />
      <SampleReport />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
