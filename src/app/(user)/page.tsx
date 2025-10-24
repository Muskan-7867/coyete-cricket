import CtaSection from "@/components/user/home/components/CtaSection";
import HomeBanner from "@/components/user/home/components/HomeBanner";
import WhyChooseUs from "@/components/user/home/components/WhyChooseUs";
import ProductPage from "@/components/user/home/components/HomeProducts";
import WhatWeSell from "@/components/user/home/components/WhatWeSell";
import CrciketBanner from "@/components/user/home/components/CrciketBanner";

export default function HomePage() {
  return <div>
    <HomeBanner />
    <WhyChooseUs />
    <ProductPage />
    <CrciketBanner />
    <WhatWeSell />
    <CtaSection />
  </div>;
}
