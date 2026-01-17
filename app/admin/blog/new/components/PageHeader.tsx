"use client";

import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

export default function PageHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Nowy post na blogu
        </h1>
        <p className="text-gray-600">
          Utwórz nowy post lub wygeneruj go za pomocą AI
        </p>
      </div>
      <Link
        href="/admin/blog"
        className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2"
      >
        <FaArrowLeft />
        <span>Powrót</span>
      </Link>
    </div>
  );
}
