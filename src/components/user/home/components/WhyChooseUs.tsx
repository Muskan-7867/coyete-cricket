"use client";
import { Award, Shield, Star } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

const Features = [
  {
    icon: Award,
    title: "Premium Quality",
    description: "Only the finest materials and craftsmanship"
  },
  {
    icon: Shield,
    title: "Trusted Brand",
    description: "Used by professionals worldwide"
  },
  // {
  //   icon: Truck,
  //   title: "Fast Delivery",
  //   description: "Quick and secure shipping",
  // },
  {
    icon: Star,
    title: "Expert Support",
    description: "24/7 customer service"
  }
];
export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CoyoteCricket?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&pos;re committed to providing the best cricket equipment and
            service
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {Features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center bg-gray-100 p-6  transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-main" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
