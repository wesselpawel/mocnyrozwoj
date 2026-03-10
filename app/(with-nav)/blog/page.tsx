import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | DzienDiety",
  description:
    "Blog jest w budowie. Pracujemy nad pozycjonowaniem i rozwojem usług.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen px-6 pt-36 pb-20">
      <section className="max-w-3xl mx-auto rounded-3xl border border-[#f7d2b0] bg-[#fff9f3] p-8 sm:p-12 text-center">
        <p className="inline-block rounded-full bg-[#e77503] px-4 py-1 text-sm font-semibold uppercase tracking-wide text-white">
          Blog
        </p>
        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1f1d1d]">
          Blog jest w budowie
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-700">
          Pracujemy nad nowymi treściami i pozycjonowaniem, aby więcej osób
          mogło trafić na naszą stronę.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-zinc-700">
          Dzięki opiniom i aktywności użytkowników będziemy stale rozwijać oraz
          ulepszać nasze usługi.
        </p>
      </section>
    </main>
  );
}
