"use client";

import { useEffect, useRef, useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  FaUser,
  FaCreditCard,
  FaDownload,
  FaCheck,
  FaArrowRight,
  FaStar,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";

export default function DietaPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      icon: FaUser,
      title: "Zaloguj się",
      description: "Utwórz konto lub zaloguj się do swojego profilu",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: FaCreditCard,
      title: "Kup dietę",
      description: "Wybierz plan dietetyczny i dokonaj bezpiecznej płatności",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      icon: FaDownload,
      title: "Pobierz i używaj",
      description: "Otrzymaj gotowy plan PDF i zacznij zdrowe odżywianie",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="pt-16 pb-12 px-6 lg:px-12 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
            Profesjonalne Diety
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Oferujemy profesjonalne plany dietetyczne oraz narzędzia rozwoju
            osobistego. Rozpocznij swoją transformację już dziś!
          </p>

          {/* Services Highlight */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <FaStar className="text-lg" />
              Profesjonalne Diety
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2">
              <FaShieldAlt className="text-lg" />
              Rozwój Osobisty
            </div>
          </div>
        </div>
      </div>

      {/* Animation Section */}
      <div className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Jak to działa?
          </h2>

          {/* Process Animation */}
          <div className="relative mb-16">
            <div className="flex justify-center items-center space-x-8 lg:space-x-16">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div key={index} className="flex flex-col items-center">
                    {/* Step Circle */}
                    <div
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold
                        transition-all duration-500 ease-in-out transform
                        ${isActive ? "scale-110 shadow-lg" : "scale-100"}
                        ${
                          isCompleted
                            ? "bg-green-500"
                            : `bg-gradient-to-r ${step.color}`
                        }
                      `}
                    >
                      {isCompleted ? <FaCheck /> : <Icon />}
                    </div>

                    {/* Step Title */}
                    <h3
                      className={`text-lg font-semibold mt-4 text-center transition-all duration-300 ${
                        isActive ? "text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {step.title}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-gray-500 text-center mt-2 max-w-32">
                      {step.description}
                    </p>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-1/2 transform -translate-x-1/2">
                        <FaArrowRight
                          className={`text-2xl transition-all duration-300 ${
                            isCompleted ? "text-green-500" : "text-gray-300"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <FaStar className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Profesjonalne Diety
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Spersonalizowane plany dietetyczne
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Gotowe jadłospisy do wydruku
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Listy zakupów i przepisy
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Wsparcie ekspertów dietetyków
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Rozwój Osobisty
                </h3>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Testy osobowości i motywacji
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Spersonalizowane raporty
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Praktyczne ćwiczenia rozwojowe
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  Śledzenie postępów
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-lg p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Rozpocznij swoją transformację
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Dołącz do tysięcy zadowolonych klientów, którzy już zmienili swoje
              życie dzięki naszym profesjonalnym dietom i narzędziom rozwoju
              osobistego.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#dieta"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaCreditCard />
                Kup Dietę
              </Link>
              <Link
                href="/#rozwoj-osobisty"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaUser />
                Rozwój Osobisty
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
