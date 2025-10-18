"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,

} from "lucide-react";
import Image from "next/image";

const Footer = () => {
  const footerLinks = {
    "BROWSE PRODUCTS": [
      { name: "BATS", href: "/products?category=bats" },
      { name: "BALLS", href: "/products?category=balls" },
      { name: "GLOVES", href: "/products?category=gloves" },
      { name: "PADS", href: "/products?category=pads" },
      { name: "BAGS", href: "/products?category=bags" },
      { name: "MATCH WEAR CLOTHING", href: "/products?category=clothing" }
    ],

    HELP: [
      { name: "Documentation", href: "/help/documentation" },
      { name: "Tutorials", href: "/help/tutorials" },
      { name: "Support View", href: "/help/support" }
    ],
    SUPPORT: [
      { name: "Help Center", href: "/support/help-center" },
      { name: "Privacy Policy", href: "/support/privacy-policy" },
      { name: "Cancellation & Return Policy", href: "/support/return-policy" },
      { name: "Shipping Policy", href: "/support/shipping-policy" },
      { name: "Payment Policy", href: "/support/payment-policy" }
    ],
    "CONTACT US": [
      { name: "Sangal Sohal Road, Backside Leather Complex", href: "#" },
      { name: "Basil Peer Dad, Jalandhar, Punjab - 144000", href: "#" },
      { name: "098885-4000", href: "tel:0988854000" },
      { name: "info@coyotecricket.com", href: "mailto:info@coyotecricket.com" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", color: "hover:text-main" },
    { icon: Twitter, href: "#", color: "hover:text-main" },
    { icon: Instagram, href: "#", color: "hover:text-main" },
    { icon: Youtube, href: "#", color: "hover:text-main" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-14 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2  ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Image
                src={"/assets/coyotelogo.png"}
                height={200}
                width={200}
                alt="Coyote cricket logo"
                className="invert w-38  "
              />
             {/* <h1 className="text-4xl font-semibold ">CO<span className="text-red-500">YOTE</span></h1>
             <h3 className="text-xl">House of Sports</h3> */}
              <p className="text-gray-300 mb-6 mt-6 max-w-md text-sm">
              Gear up for victory – Shop the best cricket equipment, crafted for champions. Whether you&apos;re a beginner or a pro, we bring you top-quality gear that takes your game to the next level.
              </p>

            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:col-span-4">
            {/* Browse Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm"
            >
              <h3 className="text-lg font-semibold text-center mb-4 text-main text-red-500">
                BROWSE PRODUCTS
              </h3>
              <ul className="space-y-4 text-center">
                {footerLinks["BROWSE PRODUCTS"].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Help */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-sm"
            >
              <h3 className="text-lg text-center font-semibold mb-4 text-main text-red-500">
                HELP
              </h3>
              <ul className="space-y-4 text-center">
                {footerLinks["HELP"].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm"
            >
              <h3 className="text-lg font-semibold mb-4 text-center text-main text-red-500">
                SUPPORT
              </h3>
              <ul className="space-y-4 text-center">
                {footerLinks["SUPPORT"].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-sm"
            >
              <h3 className="text-lg text-center font-semibold mb-4 text-red-500">
                CONTACT US
              </h3>

              {footerLinks["CONTACT US"] && (
                <ul className="space-y-4 text-center mb-4">
                  {footerLinks["CONTACT US"].map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <iframe
                title="Coyote Cricket Location"
                className="w-full h-32 border-0 rounded-md"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3408.07040373798!2d75.576!3d31.326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391a7b9c4e5e57f3%3A0x123456789abcdef!2sSingal%20Sokai%20Road%2C%20Backslots%20Leather%20Complex%2C%20Basil%20Peer%20Da%2C%20Jalandhar%2C%20Punjab%20144002!5e0!3m2!1sen!2sin!4v1738826656214!5m2!1sen!2sin"
                loading="lazy"
              ></iframe>
            </motion.div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 mt-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">
                Subscribe to get special offers and updates
              </p>
            </div>
            <div className="flex w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-main text-white placeholder-gray-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-main text-white font-medium rounded-r-lg transition-colors hover:bg-main/90"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between"
        >
          <p className="text-gray-300 mb-4 md:mb-0">
            © 2024 Coyote Cricket. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                className={`text-gray-400 ${social.color} transition-colors duration-200`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Follow us on ${social.icon.name}`}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
