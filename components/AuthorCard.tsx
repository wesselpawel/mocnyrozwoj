import Image from "next/image";
import Link from "next/link";
import profile from "@/public/favicons/android-chrome-192x192.png";
import { FaCheckCircle } from "react-icons/fa";

export const AUTHOR = {
  name: "Paweł Wessel",
  url: "https://wesselpawel.com",
} as const;

type AuthorCardProps = {
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
  /** Link do strony autora pod imieniem */
  showWebsiteLink?: boolean;
  /**
   * default – standardowy blok (np. pod artykułem)
   * stickySidebar – ten sam układ kolumnowy; dodaj className lg:sticky lg:top-28
   * banner – poziomy układ (np. pod treścią diety programowej)
   */
  variant?: "default" | "stickySidebar" | "banner";
  className?: string;
};

function AuthorBioLinks() {
  return (
    <div className="flex flex-col gap-2">
    <p className="text-sm text-zinc-600 leading-relaxed">
    Treści opracowane na podstawie badań naukowych i aktualnych zaleceń dietetycznych.
      <br />
    </p>
    <div className="flex items-center gap-2">
      <FaCheckCircle className="text-green-500 text-xl" />
      <p>Zweryfikowano</p>
      </div>
    </div>
  );
}

export default function AuthorCard({
  showCTA = true,
  ctaText = "Stwórz swoją dietę",
  ctaHref = "/generator-diety-ai",
  showWebsiteLink = false,
  variant = "default",
  className = "",
}: AuthorCardProps) {
  const isBanner = variant === "banner";
  const ctaClasses = isBanner
    ? "inline-flex items-center justify-center px-5 py-2.5 bg-[#e77503] text-white rounded-xl font-semibold text-sm hover:bg-[#e77503]/90 transition-colors flex-shrink-0"
    : "mt-4 w-full inline-flex items-center justify-center px-5 py-3 bg-[#e77503] text-white rounded-xl font-semibold hover:bg-[#d66a02] transition-colors shadow-md";
  const stickyCta =
    variant === "stickySidebar"
      ? "mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 bg-[#e77503] text-white rounded-xl font-semibold text-sm hover:bg-[#e77503]/90 transition-colors"
      : ctaClasses;

  const asideBase =
    "rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-orange-50/30 shadow-sm";
  const asidePadding =
    variant === "banner" ? "p-6 sm:p-8" : variant === "stickySidebar" ? "p-6" : "p-6";
  const asideExtra = isBanner
    ? "mt-12 pt-10 border-t border-zinc-200"
    : "";

  if (isBanner) {
    return (
      <aside
        className={`${asideBase} ${asidePadding} ${asideExtra} ${className}`.trim()}
        aria-label="Autor"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-[#e77503] rounded-full" />
          <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
            Autor
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <Image
            src={profile}
            alt={AUTHOR.name}
            width={100}
            height={100}
            className="h-20 w-20 rounded-full ring-2 ring-[#e77503]/20 ring-offset-2 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xl font-bold text-[#1f1d1d]">{AUTHOR.name}</p>
            
            <div className="mt-3">
              <AuthorBioLinks />
            </div>
          </div>
          {showCTA && (
            <Link href={ctaHref} className={stickyCta}>
              {ctaText}
            </Link>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`${asideBase} ${asidePadding} ${className}`.trim()}
      aria-label="Autor"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-1 bg-[#e77503] rounded-full" />
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
          Autor
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Image
          src={profile}
          alt={AUTHOR.name}
          width={100}
          height={100}
          className="h-16 w-16 rounded-full ring-2 ring-[#e77503]/20 ring-offset-2"
        />
        <div className="flex flex-col min-w-0">
          <p className="text-lg font-bold text-[#1f1d1d]">{AUTHOR.name}</p>
          {showWebsiteLink && (
            <Link
              href={AUTHOR.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#e77503] hover:text-[#e77503]/80 transition-colors font-medium"
            >
              wesselpawel.com ↗
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-200">
        <AuthorBioLinks />
      </div>

      {showCTA && (
        <Link
          href={ctaHref}
          className={
            variant === "stickySidebar" ? stickyCta : ctaClasses
          }
        >
          {ctaText}
        </Link>
      )}
    </aside>
  );
}
