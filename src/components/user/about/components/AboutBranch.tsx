import Image from 'next/image'
import React from 'react'

function AboutBranch() {
  return (
   <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our <span className="text-red-600">Branch</span>
        </h2>

        <div className="bg-white rounded-3xl border border-gray-200  transition-all duration-300 overflow-hidden flex flex-col md:flex-row justify-center items-center">
          {/* Left: Image - Centered */}
          <div className="relative w-full md:w-1/2 h-[28rem] flex justify-center items-center">
            <div className="relative w-4/5 h-4/5 flex justify-center items-center ">
              <Image
                src="/assets/about1.png"
                alt="Coyote Cricket Store"
                width={350}
                height={350}
                className="object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 w-full p-10 md:p-14 text-gray-800">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900">
              Visit Our Exclusive Store
            </h3>

            <div className="space-y-4 text-base leading-relaxed">
              <p>
                <span className="font-semibold text-gray-900">
                  🏢 Company Name:
                </span>{" "}
                SKM ENTERPRISES
              </p>
              <p>
                <span className="font-semibold text-gray-900">🌐 Site:</span>{" "}
                <a
                  href="https://coyotecricket.com"
                  className="text-red-600 font-medium hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  coyotecricket.com
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">
                  📍 Branch Address:
                </span>{" "}
                12, PARAM MARKET, CIRCUIT HOUSE ROAD, CIVIL LINES, JALANDHAR
                CITY, PIN 144001, PUNJAB.
              </p>
              <p>
                <span className="font-semibold text-gray-900">
                  📞 Phone No:
                </span>{" "}
                <a
                  href="tel:+919888541000"
                  className="text-red-600 font-medium hover:underline"
                >
                  +91 98885 41000
                </a>
              </p>
              <p>
                <span className="font-semibold text-gray-900">📧 Email:</span>{" "}
                <a
                  href="mailto:vik.mahajan123@gmail.com"
                  className="text-red-600 font-medium hover:underline"
                >
                  vik.mahajan123@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
  )
}

export default AboutBranch
