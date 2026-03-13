"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQProps = {
  items: FAQItem[];
  title?: string;
  allowMultiple?: boolean;
};

export default function FAQ({ items, title = "Najczęściej zadawane pytania", allowMultiple = false }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      });
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  const isOpen = (index: number) => {
    return allowMultiple ? openIndices.has(index) : openIndex === index;
  };

  return (
    <section id="faq" className="mt-12 mb-8">
      <h2 className="text-2xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
        <span className="w-1.5 h-8 bg-[#e77503] rounded-full" />
        {title}
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-zinc-200 rounded-xl overflow-hidden bg-white"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
            >
              <span className="font-semibold text-zinc-900 text-base md:text-lg">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full bg-[#e77503]/10 flex items-center justify-center transition-transform duration-200 ${
                  isOpen(index) ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 text-[#e77503]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen(index) ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-5 pt-2 border-t border-zinc-100">
                <div className="prose prose-zinc prose-sm max-w-none prose-p:text-zinc-700 prose-p:leading-relaxed prose-ul:text-zinc-700 prose-li:text-zinc-700 prose-strong:text-zinc-900 prose-table:text-zinc-700 prose-th:bg-zinc-100 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.answer}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
