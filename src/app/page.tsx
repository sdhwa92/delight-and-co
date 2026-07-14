import { HeroSection } from "@/components/hero-section";
import { BrandStorySection } from "@/components/brand-story-section";
import { CharmsSection } from "@/components/charms-section";
import { InstagramShowcaseSection } from "@/components/instagram-showcase-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <BrandStorySection />
      <CharmsSection />
      <InstagramShowcaseSection />
    </>
  );
}
