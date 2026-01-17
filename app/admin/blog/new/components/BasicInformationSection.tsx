"use client";

import { BlogPost } from "@/lib/blogService";

interface BasicInformationSectionProps {
  post: Partial<BlogPost>;
  handleInputChange: (field: keyof BlogPost, value: string) => void;
}

export default function BasicInformationSection({
  post,
  handleInputChange,
}: BasicInformationSectionProps) {
  return (
    <>
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tytuł *
          </label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="Wprowadź tytuł posta"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL slug *
          </label>
          <input
            type="text"
            value={post.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="url-sluga"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Krótki opis *
        </label>
        <textarea
          value={post.shortDesc}
          onChange={(e) => handleInputChange("shortDesc", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder="Krótki opis posta"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategoria
          </label>
          <input
            type="text"
            value={post.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="Rozwój osobisty"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagi
          </label>
          <input
            type="text"
            value={post.tags}
            onChange={(e) => handleInputChange("tags", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="tag1,tag2,tag3"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Label
          </label>
          <input
            type="text"
            value={post.urlLabel}
            onChange={(e) => handleInputChange("urlLabel", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            placeholder="Dowiedz się więcej"
          />
        </div>
      </div>
    </>
  );
}
