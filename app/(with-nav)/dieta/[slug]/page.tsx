import { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateDietPages, slugToDietParams } from "@/programmatic/diet/generator";
import { getDietTemplateData } from "@/programmatic/diet/template";

type Props = {
  params: Promise<{ slug: string }>;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

export function generateStaticParams() {
  return generateDietPages().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageParams = slugToDietParams(slug);
  if (!pageParams) {
    return { title: "Dieta | DzienDiety", description: "Jadłospis DzienDiety." };
  }
  const data = getDietTemplateData(pageParams);
  const url = `${siteUrl}/dieta/${slug}`;
  return {
    title: `${data.title} | DzienDiety`,
    description: data.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${data.title} | DzienDiety`,
      description: data.description,
      url,
      siteName: "DzienDiety",
      locale: "pl_PL",
    },
    robots: { index: true, follow: true },
  };
}

export default async function DietaPage({ params }: Props) {
  const { slug } = await params;
  const pageParams = slugToDietParams(slug);
  if (!pageParams) notFound();

  const data = getDietTemplateData(pageParams);

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{data.h1}</h1>
        <p className="mt-2 text-lg text-neutral-600">{data.description}</p>
      </header>
      <div className="prose prose-neutral max-w-none">
        {data.sections.map((section, i) => (
          <section key={i} className="mb-8">
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <p className="mt-2 whitespace-pre-line text-neutral-700">{section.text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
