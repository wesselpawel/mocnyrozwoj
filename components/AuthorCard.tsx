import Image from "next/image";
import Link from "next/link";
import profile from "@/public/donut.jpg";

type AuthorCardProps = {
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
};

const author = {
  name: "Paweł Wessel",
  url: "https://wesselpawel.com",
};

export default function AuthorCard({
  showCTA = true,
  ctaText = "Stwórz swoją dietę",
  ctaHref = "/generator-diety-ai",
}: AuthorCardProps) {
  return (
    <aside className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-orange-50/30 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-1 bg-[#e77503] rounded-full" />
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
          Autor
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Image
          src={profile}
          alt={author.name}
          width={100}
          height={100}
          className="h-16 w-16 rounded-full ring-2 ring-[#e77503]/20 ring-offset-2"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold text-[#1f1d1d]">{author.name}</p>
          <Link
            href={author.url}
            target="_blank"
            className="text-sm text-[#e77503] hover:text-[#e77503]/80 transition-colors font-medium"
          >
            wesselpawel.com ↗
          </Link>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-200">
        <p className="text-sm text-zinc-600 leading-relaxed">
          Twórca najlepszego{" "}
          <Link
            href="/generator-diety-ai"
            className="text-[#e77503] font-semibold hover:underline"
          >
            generatora diety AI za darmo
          </Link>
          {" "}— dziendiety.pl
        </p>
      </div>

      {showCTA && (
        <Link
          href={ctaHref}
          className="mt-4 w-full inline-flex items-center justify-center px-5 py-3 bg-[#e77503] text-white rounded-xl font-semibold hover:bg-[#d66a02] transition-colors shadow-md"
        >
          {ctaText}
        </Link>
      )}
    </aside>
  );
}
