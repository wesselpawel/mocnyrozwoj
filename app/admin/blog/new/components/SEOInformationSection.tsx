"use client";

import { BlogPost } from "@/lib/blogService";

interface SEOInformationSectionProps {
  post: Partial<BlogPost>;
  handleInputChange: (field: keyof BlogPost, value: string) => void;
}

export default function SEOInformationSection({
  post,
  handleInputChange,
}: SEOInformationSectionProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Informacje SEO
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Title
          </label>
          <input
            type="text"
            value={post.googleTitle}
            onChange={(e) => handleInputChange("googleTitle", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="Tytuł dla Google"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Keywords
          </label>
          <input
            type="text"
            value={post.googleKeywords}
            onChange={(e) =>
              handleInputChange("googleKeywords", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="słowa kluczowe"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Google Description
        </label>
        <textarea
          value={post.googleDescription}
          onChange={(e) =>
            handleInputChange("googleDescription", e.target.value)
          }
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Opis dla Google"
        />
      </div>
    </div>
  );
}
