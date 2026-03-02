"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

export interface FAQItem {
  question: string;
  answer?: string;
  answers?: string[];
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
  allowMultiple?: boolean;
}

function getAnswerText(item: FAQItem): string {
  if (item.answer) return item.answer;
  if (Array.isArray(item.answers)) return item.answers.join(" ");
  return "";
}

export default function FAQ({
  items,
  title,
  className = "",
  allowMultiple = false,
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const isOpen = (index: number) =>
    allowMultiple ? openIndices.has(index) : openIndex === index;

  const toggle = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) => {
        const next = new Set(prev);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    } else {
      setOpenIndex((prev) => (prev === index ? null : index));
    }
  };

  if (!items?.length) return null;

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      <div className="space-y-3">
        {items.map((item, index) => {
          const answerText = getAnswerText(item);
          const expanded = isOpen(index);

          return (
            <motion.div
              key={index}
              initial={false}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              layout
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-4 px-4 py-4 sm:px-5 sm:py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 rounded-xl"
                aria-expanded={expanded}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="font-semibold text-gray-800 text-sm sm:text-base pr-2">
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="flex-shrink-0 text-gray-500"
                >
                  <FaChevronDown className="w-4 h-4" aria-hidden />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {expanded && answerText && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: "easeInOut" },
                        opacity: { duration: 0.2, delay: 0.05 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.25, ease: "easeInOut" },
                        opacity: { duration: 0.15 },
                      },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {answerText}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
