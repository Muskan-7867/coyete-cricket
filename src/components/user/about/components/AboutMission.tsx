import React from 'react'

function AboutMission() {
  return (
     <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To empower every cricketer with reliable, high-performance gear
              that enhances their game and celebrates their love for cricket.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To be the world’s most trusted cricket brand, known for quality,
              innovation, and a deep commitment to the sport’s spirit.
            </p>
          </div>
        </div>
      </section>
  )
}

export default AboutMission
