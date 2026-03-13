"use client";

interface SectionLinkButtonProps {
  targetId: string;
  text: string;
}

export default function SectionLinkButton({ targetId, text }: SectionLinkButtonProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={scrollToSection}
      className="mt-4 inline-flex items-center px-4 py-2 bg-[#e77503] text-white rounded-lg font-medium hover:bg-[#e77503]/90 transition-colors text-sm"
    >
      {text}
    </button>
  );
}
