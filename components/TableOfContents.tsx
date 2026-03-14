"use client";

import { useEffect, useState } from "react";
import type { BlogSection } from "@/lib/publicBlogEntries";

interface TableOfContentsProps {
  sections: BlogSection[];
  title: string;
  hasFaq?: boolean;
  hasJadlospis?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FAQ_ID = "faq";
const FAQ_TITLE = "Najczęściej zadawane pytania";
const JADLOSPIS_ID = "jadlospis";
const JADLOSPIS_TITLE = "Przykładowy jadłospis z przepisami";

export default function TableOfContents({ sections, title, hasFaq, hasJadlospis }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const sectionIds = sections
      .map((s) => s.id || slugify(s.title))
      .filter(Boolean);
    
    if (hasFaq) {
      sectionIds.push(FAQ_ID);
    }
    if (hasJadlospis) {
      sectionIds.push(JADLOSPIS_ID);
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          if (entry.target.id === FAQ_ID) {
            document.title = `${FAQ_TITLE} | DzienDiety`;
          } else if (entry.target.id === JADLOSPIS_ID) {
            document.title = `${JADLOSPIS_TITLE} | DzienDiety`;
          } else {
            const section = sections.find(
              (s) => (s.id || slugify(s.title)) === entry.target.id
            );
            if (section) {
              document.title = `${section.title} | DzienDiety`;
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
      document.title = `${title} | DzienDiety`;
    };
  }, [sections, title, hasFaq, hasJadlospis]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsOpen(false);
    }
  };

  return (
    <nav className="mb-8 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-zinc-800">📑 Spis treści</span>
        <span className="text-zinc-500 text-sm">
          {isOpen ? "▲ Zwiń" : "▼ Rozwiń"}
        </span>
      </button>

      {isOpen && (
        <ul className="mt-4 space-y-2">
          {sections.map((section, idx) => {
            const sectionId = section.id || slugify(section.title);
            const isActive = activeSection === sectionId;

            return (
              <li key={idx}>
                <button
                  onClick={() => scrollToSection(sectionId)}
                  className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                    isActive
                      ? "bg-[#e77503] text-white font-medium"
                      : "text-zinc-600 hover:text-[#e77503] hover:bg-zinc-100"
                  }`}
                >
                  {section.title}
                </button>
              </li>
            );
          })}
          {hasFaq && (
            <li>
              <button
                onClick={() => scrollToSection(FAQ_ID)}
                className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                  activeSection === FAQ_ID
                    ? "bg-[#e77503] text-white font-medium"
                    : "text-zinc-600 hover:text-[#e77503] hover:bg-zinc-100"
                }`}
              >
                {FAQ_TITLE}
              </button>
            </li>
          )}
          {hasJadlospis && (
            <li>
              <button
                onClick={() => scrollToSection(JADLOSPIS_ID)}
                className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                  activeSection === JADLOSPIS_ID
                    ? "bg-[#e77503] text-white font-medium"
                    : "text-zinc-600 hover:text-[#e77503] hover:bg-zinc-100"
                }`}
              >
                {JADLOSPIS_TITLE}
              </button>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}
