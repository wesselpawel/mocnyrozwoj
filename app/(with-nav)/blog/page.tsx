import { Metadata } from "next";
import { cookies } from "next/headers";
import BlogLibraryContent from "./BlogLibraryContent";
import {
  getPublicBlogEntries,
  filterBlogEntriesByGeneratedDiet,
} from "@/lib/publicBlogEntries";
import { getAdminSessionCookieName, isValidAdminSessionToken } from "@/lib/adminAuth";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  await searchParams;

  return {
    title: "234 plany dietetyczne z przepisami i listą zakupów",
    description:
      "Blog planów dietetycznych z przepisami i listą zakupów. Diety na masę, redukcję i utrzymanie wagi.",
  };
}

export default async function BlogPage({ searchParams }: Props) {
  await searchParams;
  const entries = await getPublicBlogEntries();
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminSessionCookieName())?.value;
  const isAdmin = await isValidAdminSessionToken(token);
  const filteredEntries = filterBlogEntriesByGeneratedDiet(entries, null, isAdmin);
  return <BlogLibraryContent selectedCategory={null} entries={filteredEntries} />;
}
