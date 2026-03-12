import { Metadata } from "next";
import BlogLibraryContent from "./BlogLibraryContent";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  await searchParams;

  return {
    title: "Blog Dietetyczny | DzienDiety",
    description:
      "Biblioteka wiedzy dietetycznej: diety, przykładowe dni, cele żywieniowe oraz przepisy dietetyczne.",
  };
}

export default async function BlogPage({
  searchParams,
}: Props) {
  await searchParams;
  return <BlogLibraryContent selectedCategory={null} />;
}
