"use client";
import { useState } from "react";
import DietDetailModal from "./DietDetailModal";
import { Diet } from "@/types";

export default function TestDietModal({ diet }: { diet: Diet }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Test Diet Modal</h2>
        <p className="text-gray-600 mb-6">
          Click the button below to test the diet detail modal functionality.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
        >
          Test Diet Modal
        </button>

        <DietDetailModal
          diet={diet}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
