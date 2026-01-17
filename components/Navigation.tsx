"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import logo from "@/public/logo.png";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3"
            onClick={closeMobileMenu}
          >
            <Image
              src={logo}
              width={512}
              height={512}
              alt="Mocny Rozwój Osobisty Logo"
              className="h-10 w-10"
            />
            <span className="font-bold text-xl text-gray-900">
              MocnyRozwój.pl
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dieta"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Dieta
            </Link>
            <Link
              href="/#courses"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Kursy
            </Link>

            {/* <Link
              href="/blog"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Blog
            </Link> */}
            <Link
              href="/faq"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 font-medium"
            >
              Kontakt
            </Link>
            <Link
              href="/login"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
            >
              Logowanie
            </Link>
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
              <Link
                href="/dieta"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Dieta
              </Link>
              <Link
                href="/#courses"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Kursy
              </Link>

              <Link
                href="/blog"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Blog
              </Link>
              <Link
                href="/faq"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Kontakt
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium text-center"
                onClick={closeMobileMenu}
              >
                Logowanie
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
