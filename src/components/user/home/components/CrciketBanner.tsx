"use client";

import Image from "next/image";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CrciketBanner() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Horizontal parallax effect
  const x = useTransform(scrollYProgress, [0, 1], ["-100px", "100px"]);
  const scale = useTransform(scrollYProgress, [0, 1], [3, 1]);

  return (
    <section
      ref={ref}
      className="relative w-full h-[32rem] my-18 overflow-hidden"
    >
      {/* Background wrapper (fixed) */}
      <div className="absolute inset-0 w-full flex justify-end overflow-hidden">
        <motion.div style={{ x, scale }} className="h-full w-full">
          <Image
            src="https://images.augustman.com/wp-content/uploads/sites/6/2023/04/16072649/Untitled-design-2023-04-16T071319.214.jpg?tr=w-1920"
            alt="Shopping Background"
            height={900}
            width={900}
            className="object-cover h-full w-full"
          />
        </motion.div>

        {/* Blur stays fixed */}
        <div className="absolute inset-0 backdrop-blur-md pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-[35rem] max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Left - Text Section */}
        <div className="w-full h-full lg:w-1/2 lg:text-left flex flex-col justify-center text-white p-4">
          <h4 className="text-sm font-semibold"> Gear Up Like a Pro</h4>
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold leading mt-2">
            Unleash Your Game <br /> With Premium Cricket Gear
          </h1>
          <p className="mt-4 text-sm text-white w-48 sm:w-full">
            From bats to pads, gloves to jerseys — everything you need to own
            the pitch.
          </p>
          <button className="mt-8 w-36 h-10 rounded-md bg-white text-black font-semibold transition-all duration-300 hover:bg-transparent hover:text-white hover:border hover:border-white">
            Shop Now
          </button>
        </div>

        {/* Right - Model Image */}
        <div className="flex items-end pointer-events-none">
          <div className="w-full h-full overflow-hidden">
            <div className="absolute bottom-0 right-0 flex flex-col h-full overflow-hidden">
              <Image
                src="/assets/model1.png"
                alt="Corn on the cob"
                width={800}
                height={800}
                className="w-auto h-full object-cover pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
