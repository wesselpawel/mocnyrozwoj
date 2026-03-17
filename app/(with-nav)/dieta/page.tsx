import { Metadata } from "next";
import { cookies } from "next/headers";
import BlogLibraryContent from "@/app/(with-nav)/blog/BlogLibraryContent";
import {
  getPublicBlogEntries,
  filterBlogEntriesByGeneratedDiet,
} from "@/lib/publicBlogEntries";
import { getAdminSessionCookieName, isValidAdminSessionToken } from "@/lib/adminAuth";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  await searchParams;
  return {
    title: "Plany dietetyczne z przepisami i listą zakupów",
    description:
      "Planowanie diety online za darmo. Diety na masę, redukcję i utrzymanie wagi. Spersonalizowane jadłospisy z listą zakupów. Darmowe przepisy na dania.",
    alternates: { canonical: "/dieta" },
  };
}

export default async function DietIndexPage({ searchParams }: Props) {
  await searchParams;
  const entries = await getPublicBlogEntries();
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value;
  const isAdmin = await isValidAdminSessionToken(token);
  const filteredEntries = filterBlogEntriesByGeneratedDiet(entries, null, isAdmin);
  return (
    <BlogLibraryContent selectedCategory={null} entries={filteredEntries} isAdmin={isAdmin} />
  );
}

