"use client";

import { FaPlus } from "react-icons/fa";
import ContentSectionEditor from "./ContentSectionEditor";

import { ContentSection } from "../types";

interface ContentSectionsManagerProps {
  sections: ContentSection[];
  updateSection: (
    index: number,
    field: "title" | "content",
    value: string
  ) => void;
}

export default function ContentSectionsManager({
  sections,
  updateSection,
}: ContentSectionsManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Treść posta</h3>
      </div>

      {sections.map((section, index) => (
        <ContentSectionEditor
          key={section.id}
          section={section}
          index={index}
          updateSection={updateSection}
        />
      ))}
    </div>
  );
}
