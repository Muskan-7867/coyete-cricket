import Image from 'next/image'
import React from 'react'

export default function AboutProduct() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-center">
      <h2 className="text-4xl font-bold mb-4">Our Products</h2>
      <p className="text-gray-600 mb-12">
        Explore our wide range of cricket essentials, crafted to enhance your game.
      </p>
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
        {/* Product 1 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <Image
            src="/assets/bat1.jfif"
            alt="Cricket Bat"
            width={200}
            height={200}
            className="mx-auto mb-4 transform transition-transform duration-300 hover:-translate-y-4"
          />
          <h3 className="font-semibold mb-2">Cricket Bats</h3>
          <p className="text-gray-600 text-sm">Top-quality willow bats for all skill levels.</p>
        </div>

        {/* Product 2 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <Image
            src="/assets/tshirt.png"
            alt="Cricket T-Shirts"
            width={150}
            height={150}
            className="mx-auto mb-4 transform transition-transform duration-300 hover:-translate-y-4"
          />
          <h3 className="font-semibold mb-2">Cricket T-Shirts</h3>
          <p className="text-gray-600 text-sm">Premium leather and tennis balls for matches and practice.</p>
        </div>

        {/* Product 3 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <Image
            src="/assets/sweater.jfif"
            alt="Cricket Sweaters"
            width={200}
            height={200}
            className="mx-auto mb-4 transform transition-transform duration-300 hover:-translate-y-4"
          />
          <h3 className="font-semibold mb-2">Cricket Sweaters</h3>
          <p className="text-gray-600 text-sm">Stay warm with our comfortable cricket sweaters.</p>
        </div>

        {/* Product 4 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <Image
            src="/assets/helmet.jfif"
            alt="Protective Gear"
            width={200}
            height={200}
            className="mx-auto mb-4 transform transition-transform duration-300 hover:-translate-y-4"
          />
          <h3 className="font-semibold mb-2">Protective Gear</h3>
          <p className="text-gray-600 text-sm">Safety-first helmets, pads, and gloves.</p>
        </div>

        {/* Product 5 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <Image
            src="/assets/gloves.jpg"
            alt="Batting Gloves"
            width={200}
            height={200}
            className="mx-auto mb-4 transform transition-transform duration-300 hover:-translate-y-4"
          />
          <h3 className="font-semibold mb-2">Batting Gloves</h3>
          <p className="text-gray-600 text-sm">High-quality footwear for grip and comfort.</p>
        </div>

        {/* Product 6 */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <Image
            src="/assets/bag1.jpg"
            alt="Bags"
            width={100}
            height={100}
            className="mx-auto mb-4 transform transition-transform duration-300 hover:-translate-y-4"
          />
          <h3 className="font-semibold mb-2">Bags</h3>
          <p className="text-gray-600 text-sm">Carry your gear in style and comfort.</p>
        </div>
      </div>
    </section>
  )
}
