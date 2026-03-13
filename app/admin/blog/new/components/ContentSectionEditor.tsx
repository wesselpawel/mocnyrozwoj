"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Ładowanie edytora...</p>,
});

// Toolbar options matching quixy implementation
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["clean"],
];

import { ContentSection } from "../types";

interface ContentSectionEditorProps {
  section: ContentSection;
  index: number;
  updateSection: (
    index: number,
    field: "title" | "content",
    value: string
  ) => void;
}

export default function ContentSectionEditor({
  section,
  index,
  updateSection,
}: ContentSectionEditorProps) {
  const sectionNumber = index + 1;

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            Sekcja {sectionNumber}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tytuł sekcji
        </label>
        <input
          type="text"
          value={section.title}
          onChange={(event) => updateSection(index, "title", event.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          placeholder={`Sekcja ${sectionNumber}`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Treść sekcji
        </label>
        <div className="rounded-md">
          <ReactQuill
            theme="snow"
            placeholder={!section.content ? "Wpisz tekst" : ""}
            className={`border rounded-md border-gray-300 text-black bg-white w-full`}
            modules={{
              toolbar: {
                container: TOOLBAR_OPTIONS,
              },
            }}
            value={section.content}
            onChange={(content) => updateSection(index, "content", content)}
          />
        </div>
      </div>
    </div>
  );
}
