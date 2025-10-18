import CtaSection from "@/components/user/home/components/CtaSection";
import HomeBanner from "@/components/user/home/components/HomeBanner";
import { NavigationTabs } from "@/components/user/home/components/NavigationTabs";
import WhyChooseUs from "@/components/user/home/components/WhyChooseUs";
import ProductPage from "@/components/user/home/components/HomeProducts";
import WhatWeSell from "@/components/user/home/components/WhatWeSell";

export default function HomePage() {
  return <div>
    <HomeBanner />
    <WhyChooseUs />
    <NavigationTabs />
    <ProductPage />
    <WhatWeSell />
    <CtaSection />
  </div>;
}
