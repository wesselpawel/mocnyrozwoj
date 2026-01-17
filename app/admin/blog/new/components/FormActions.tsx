"use client";

import { FaSave } from "react-icons/fa";
import Link from "next/link";

interface FormActionsProps {
  loading: boolean;
  handleSavePost: () => void;
}

export default function FormActions({
  loading,
  handleSavePost,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
      <Link
        href="/admin/blog"
        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300"
      >
        Anuluj
      </Link>
      <button
        type="button"
        onClick={handleSavePost}
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Zapisywanie...</span>
          </>
        ) : (
          <>
            <FaSave />
            <span>Zapisz post</span>
          </>
        )}
      </button>
    </div>
  );
}
