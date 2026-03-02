"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import logo from "@/public/logoNew.png";

// Array for main navigation links
const NAV_ITEMS = [
  {
    label: "Dieta",
    href: "/dieta",
    className:
      "text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium",
    mobileClass:
      "block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200",
    show: true,
  },
  // Uncomment to enable blog/faq
  // {
  //   label: "Blog",
  //   href: "/blog",
  //   className: "text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium",
  //   mobileClass:
  //     "block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200",
  //   show: false,
  // },
  // {
  //   label: "FAQ",
  //   href: "/faq",
  //   className: "text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium",
  //   mobileClass:
  //     "block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200",
  //   show: false,
  // },
  {
    label: "Kontakt",
    href: "/contact",
    className:
      "text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium",
    mobileClass:
      "block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200",
    show: true,
  },
  {
    label: "Logowanie",
    href: "/login",
    className:
      "border-2 border-[#e77503] text-[#e77503] px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium",
    mobileClass:
      "block px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium text-center",
    show: true,
  },
];

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScroll = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      // Show when scrolling up, hide when scrolling down
      if (current <= 0) {
        setVisible(true);
      } else if (current > lastScroll.current && current > 50) {
        // Scrolling down
        setVisible(false);
      } else if (current < lastScroll.current) {
        // Scrolling up
        setVisible(true);
      }
      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`z-[100] fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* logo */}
          <Link
            href="/"
            className="flex items-center space-x-3"
            onClick={closeMobileMenu}
          >
            <Image
              src={logo}
              width={512}
              height={512}
              alt="Mocny Rozwój Osobisty logo"
              className="w-24 h-auto"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.filter((i) => i.show).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.className}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {NAV_ITEMS.filter((i) => i.show).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={item.mobileClass}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
