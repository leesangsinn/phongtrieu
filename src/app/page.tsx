import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import ProductLine from "@/components/sections/ProductLine";
import Distribute from "@/components/sections/Distribute";
import News from "@/components/sections/News";
import Contact from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Story />
      <ProductLine />
      <News />
      <Distribute />
      <Contact />
    </>
  );
}
