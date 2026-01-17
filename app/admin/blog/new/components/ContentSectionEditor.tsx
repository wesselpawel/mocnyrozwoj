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
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">Treść posta</span>
        </div>
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
