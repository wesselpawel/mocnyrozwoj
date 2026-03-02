import React, { useState } from "react";
import { FaTimes, FaShoppingCart, FaEnvelope, FaLock } from "react-icons/fa";
import Image from "next/image";
import { modalStyles } from "./modalStyles";

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (email: string) => Promise<void>;
  item: {
    id: string;
    title: string;
    price: number;
    type: "course" | "diet";
  };
}

export default function GuestCheckoutModal({
  isOpen,
  onClose,
  onPurchase,
  item,
}: GuestCheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Proszę podać adres email");
      return;
    }

    if (!validateEmail(email)) {
      setError("Proszę podać prawidłowy adres email");
      return;
    }

    try {
      setIsLoading(true);
      await onPurchase(email);
    } catch {
      setError("Wystąpił błąd podczas procesu zakupu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles.backdrop} onClick={onClose}>
      <div
        className={`${modalStyles.panel} max-w-md mx-auto max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`${modalStyles.gradientHeader} flex items-center justify-between p-5 sm:p-6`}
        >
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-white/20 p-2">
              <FaShoppingCart className="text-white text-base" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Szybki zakup
            </h3>
          </div>
          <button
            onClick={onClose}
            className={modalStyles.closeButton}
            aria-label="Zamknij szybki zakup"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {/* Product Info */}
          <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 p-4 rounded-xl mb-6 border border-violet-100/80">
            <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-600 mb-2">
              {item.type === "course" ? "Kurs" : "Plan dietetyczny"}
            </p>
            <div className="text-lg font-bold text-purple-600">
              {item.price} PLN
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-6">
            <h5 className="font-medium text-gray-800 mb-3">
              🎯 Po zakupie otrzymasz:
            </h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Natychmiastowy dostęp do materiałów</li>
              <li>• Możliwość założenia konta po zakupie</li>
              <li>• Bezpieczną płatność przez Stripe</li>
              <li>• Paragon wysłany na email</li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2 text-gray-400" />
                Adres email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="twoj@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Użyjemy tego adresu do wysłania paragonu i informacji o zakupie
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white py-3 px-4 rounded-xl font-medium hover:from-violet-700 hover:to-fuchsia-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Przetwarzanie...
                </div>
              ) : (
                <>
                  <FaLock className="inline mr-2" />
                  Przejdź do płatności
                </>
              )}
            </button>
          </form>

          {/* Security Image */}
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50/80 p-3 sm:p-4">
            <div className="mx-auto w-full max-w-[280px] sm:max-w-[340px]">
              <Image
                src="/blik.webp"
                alt="Bezpieczna płatność BLIK i Stripe"
                width={900}
                height={240}
                className="w-full h-auto object-contain"
                sizes="(max-width: 640px) 280px, 340px"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
