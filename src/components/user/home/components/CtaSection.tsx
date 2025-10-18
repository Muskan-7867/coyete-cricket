"use client"
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section
      className={`relative py-20 bg-[url('https://www.keithprowse.co.uk/-/media/blog/2025/january/cricket-superstitions/1440x600-superstitions-min.png?h=600&iar=0&w=1440&hash=8EA9C594D93203CFFB023F55F6ED6577')] bg-no-repeat bg-cover bg-start`}
    >
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Upgrade Your Game?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of cricketers who trust CricketPro for their
            equipment needs
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-white text-main hover:bg-gray-100 font-semibold rounded-full transition-colors duration-200"
            >
              Start Shopping
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
