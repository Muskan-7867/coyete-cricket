'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function WhatWeSell() {
  const products = [
    {
      id: 1,
      title: 'Bats',
      description: 'Expertly handcrafted for perfect balance ',
      image: '/assets/bat1.jfif',
      category: 'bats',
      bgColor: 'bg-gray-100'
    },
    {
      id: 2,
      title: 'T-Shirts',
      description: 'Built for champions. Inspired by the game - Elevate your cricket spirit.',
      image: "/assets/tshirt.png",
      category: 'clothing',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      title: 'Gloves',
      description: 'Arm focused construction. New comfort layer padding technology.',
      image: "/assets/gloves.jpg",
      category: 'protective-gear',
      bgColor: 'bg-green-50'
    },
    {
      id: 4,
      title: 'Bags',
      description: 'Safest Series Kit Bag. Hardwearing duffel and cricket bag for all players.',
      image: '/assets/bag.jpg',
      category: 'accessories',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-8 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text- mb-4">
            What We Sell
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Discover our comprehensive range of cricket equipment and apparel
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`${product.bgColor}  p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2`}
            >
              {/* Product Title */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Product Image */}
              <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-white/50 flex justify-center items-center">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={150}
                  height={150}
                  className="object-cover group-hover:scale-110 transition-transform duration-500 p-4" 
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* View Range Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/products?category=${product.category}`}
                  className="w-full bg-gray-900 text-white py-3 px-4  font-semibold text-center block hover:bg-gray-800 transition-colors duration-200"
                >
                  View Range
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>

          
      </div>
    </section>
  );
}