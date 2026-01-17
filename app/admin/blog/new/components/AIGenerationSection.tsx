"use client";

import { FaMagic } from "react-icons/fa";

interface AIGenerationSectionProps {
  topic: string;
  setTopic: (topic: string) => void;
  generating: boolean;
  handleGeneratePost: () => void;
}

export default function AIGenerationSection({
  topic,
  setTopic,
  generating,
  handleGeneratePost,
}: AIGenerationSectionProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FaMagic className="mr-2 text-purple-600" />
        Generowanie AI
      </h2>
      <div className="flex space-x-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Wprowadź temat posta (np. 'motywacja', 'produktywność')"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
        <button
          onClick={handleGeneratePost}
          disabled={generating || !topic.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generowanie...</span>
            </>
          ) : (
            <>
              <FaMagic />
              <span>Wygeneruj post</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
