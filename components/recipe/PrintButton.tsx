"use client";

import { FaPrint } from "react-icons/fa";

export default function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-medium text-sm transition-colors print:hidden"
    >
      <FaPrint />
      <span>Wydrukuj przepis</span>
    </button>
  );
}
