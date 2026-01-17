"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import {
  FaPlus,
  FaImages,
  FaClipboardList,
  FaUser,
  FaGraduationCap,
  FaBook,
} from "react-icons/fa";

export default function AdminPage() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="p-6 lg:p-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 lg:p-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Dostęp zabroniony
          </h1>
          <p className="text-gray-600">
            Musisz się zalogować, aby uzyskać dostęp do panelu
            administracyjnego.
          </p>
        </div>
      </div>
    );
  }

  const adminCards = [
    {
      title: "Dodaj kurs",
      description: "Utwórz nowy kurs rozwojowy",
      icon: <FaGraduationCap className="text-2xl" />,
      href: "/admin/courses/add",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      title: "Wszystkie kursy",
      description: "Zarządzaj istniejącymi kursami",
      icon: <FaBook className="text-2xl" />,
      href: "/admin/courses/list",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      title: "Dodaj produkt",
      description: "Utwórz nowy produkt w sklepie",
      icon: <FaPlus className="text-2xl" />,
      href: "/admin/shop/add-product",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      title: "Wszystkie produkty",
      description: "Zarządzaj istniejącymi produktami",
      icon: <FaImages className="text-2xl" />,
      href: "/admin/shop/products",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      title: "Zamówienia",
      description: "Przeglądaj i zarządzaj zamówieniami",
      icon: <FaClipboardList className="text-2xl" />,
      href: "/admin/shop/orders",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      title: "Profil",
      description: "Zarządzaj swoim kontem",
      icon: <FaUser className="text-2xl" />,
      href: "/admin/profile",
      color: "bg-red-500 hover:bg-red-600",
    },
  ];

  return (
    <div className="p-6 lg:p-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Panel administracyjny
        </h1>
        <p className="text-gray-600">
          Witaj, {user.email}! Oto przegląd funkcji administracyjnych.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Link key={index} href={card.href}>
            <div
              className={`${card.color} text-white p-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-white/80 text-sm">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Szybkie statystyki
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500">0</div>
            <div className="text-gray-600">Aktywne kursy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">0</div>
            <div className="text-gray-600">Aktywne produkty</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">0</div>
            <div className="text-gray-600">Nowe zamówienia</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">0</div>
            <div className="text-gray-600">Użytkownicy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
