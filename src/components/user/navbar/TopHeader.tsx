"use client";
import Link from "next/link";
import { Facebook, Linkedin } from "lucide-react";

export default function TopHeader() {



  return (
    <div className="w-full fixed top-0 left-0 right-0 z-50 bg-black text-white text-xs sm:text-sm py-2">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left: Contact Information (hidden on small screens) */}
        <div className="hidden sm:flex flex-wrap justify-center sm:justify-start items-center gap-3 text-gray-300 text-[12px] sm:text-[13px]">
          <div className="flex items-center gap-1">
            <span>📞</span>
            <Link
              href="tel:+91988841000"
              className="hover:text-white transition-colors"
            >
              +91 9888 41000
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span>📞</span>
            <Link
              href="tel:+919888531000"
              className="hover:text-white transition-colors"
            >
              +91 9888 531000
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <span>✉️</span>
            <Link
              href="mailto:info@coyotecricket.com"
              className="hover:text-white transition-colors"
            >
              info@coyotecricket.com
            </Link>
          </div>
        </div>

        {/* Right: About Us + Social Links (centered on mobile) */}
        <div className="flex items-center gap-3 justify-center w-full sm:w-auto">
          <Link
            href="/about"
            className="text-black bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 border px-3 py-[4px] rounded-md border-white/30 transition-colors text-xs sm:text-sm font-medium"
          >
            About Us
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-400 transition-colors"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
