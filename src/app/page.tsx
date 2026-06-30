import { Hero } from "@/components/sections/hero";
import { WhyHubology } from "@/components/sections/why-hubology";
import { Testimonials } from "@/components/sections/testimonials";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyHubology />
      <Testimonials />
      <CtaBand />
    </>
  );
}
