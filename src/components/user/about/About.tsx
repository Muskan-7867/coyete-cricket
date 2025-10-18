import React from "react";
import Image from "next/image";
import AboutMission from "./components/AboutMission";
import AboutBranch from "./components/AboutBranch";
import AboutProduct from "./components/AboutProduct";

function About() {
  return (
    <div className="bg-white text-gray-800 mt-28 lg:mt-36">
      {/* Hero Section */}
      <section className="relative w-full h-[45rem]">
        <Image
          src="/assets/about.webp"
          alt="Cricket Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <h1 className="text-5xl md:text-5xl font-bold">ABOUT US</h1>
          <p className="text-lg md:text-xl font-medium mt-4 max-w-6xl leading-relaxed">
            Welcome to{" "}
            <span className="bg-red-500 px-2 py-1 rounded-md font-semibold">
              COYOTE - House of Sports
            </span>
            , your go-to destination for premium cricket gear and apparel. We
            are passionate about the game and strive to support cricket players
            at all levels by providing top-quality products and expert advice.
          </p>
        </div>
      </section>

      {/* Company Intro */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
        <p className="text-gray-600 leading-relaxed max-w-5xl mx-auto">
          Since 1995, company has been engaged in making cricket equipment for
          world market, gradually we have engaged ourselves in increasing the
          scope of manufacturing from cricket equipment to world class all sport
          clothing. Continuing family legacy current directors vivek and vikas
          mahajan played cricket for around 15 yrs at various level, vivek
          mahajan excelled to play first class for Punjab and junior India ,
          there vision was to position coyote brand as an authentic, cricket
          equipment manufacturing brand. This vision has become a reality. We
          have developed a team workers who are passionate about being the best
          and despite making thousands of products every year, they continue to
          take the upmost care when making all products. They are focused on
          every fine and integral detail.
        </p>
      </section>

      {/* Mission & Vision */}
      <AboutMission />

     
      <AboutBranch />


      {/* Core Values */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold mb-8">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-bold mb-3">Quality First</h4>
            <p className="text-gray-600">
              Every product is crafted with precision and tested for top-tier
              performance and durability.
            </p>
          </div>
          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-bold mb-3">Passion for Cricket</h4>
            <p className="text-gray-600">
              Cricket isn’t just a sport to us — it’s our inspiration and
              identity.
            </p>
          </div>
          <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
            <h4 className="text-xl font-bold mb-3">Innovation & Trust</h4>
            <p className="text-gray-600">
              We constantly evolve to meet the needs of modern cricketers while
              staying true to the game’s traditions.
            </p>
          </div>
        </div>
      </section>

       <AboutProduct />

      {/* CTA */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Game?</h2>
        <p className="text-gray-300 mb-6">
          Discover our latest cricket gear and experience the difference.
        </p>
        <a
          href="/shop"
          className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        >
          Shop Now
        </a>
      </section>
    </div>
  );
}

export default About;
