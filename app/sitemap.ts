import type { MetadataRoute } from "next";
import { getPublicBlogEntries } from "@/lib/publicBlogEntries";
import { categories, categorySlugs } from "@/app/(with-nav)/blog/data";
import {
  getDietPagePath,
  getMassHubPath,
  getReductionHubPath,
  getMaintenanceHubPath,
} from "@/programmatic/diet/generator";
import { calories } from "@/programmatic/diet/data";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dziendiety.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const today = new Date();

  entries.push(
    { url: baseUrl, lastModified: today, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: today, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/generator-diety-ai`, lastModified: today, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/kalkulator-kcal`, lastModified: today, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/przepisy`, lastModified: today, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: today, changeFrequency: "yearly", priority: 0.5 }
  );

  for (const category of categories) {
    const slug = categorySlugs[category as keyof typeof categorySlugs];
    if (slug) {
      entries.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    }
  }

  for (const calorie of calories) {
    entries.push({
      url: `${baseUrl}/dieta/${getMassHubPath(calorie)}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
    entries.push({
      url: `${baseUrl}/dieta/${getReductionHubPath(calorie)}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
    entries.push({
      url: `${baseUrl}/dieta/${getMaintenanceHubPath(calorie)}`,
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    });
  }

  const allEntries = await getPublicBlogEntries();

  for (const entry of allEntries) {
    if (entry.programmaticDiet) {
      const path = getDietPagePath({
        calorie: entry.programmaticDiet.calories,
        goal: entry.programmaticDiet.goal,
        mealCount: entry.programmaticDiet.mealCount,
      });
      entries.push({
        url: `${baseUrl}/dieta/${path}`,
        lastModified: today,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      });
    } else if (entry.href?.startsWith("/przepisy/")) {
      entries.push({
        url: `${baseUrl}${entry.href}`,
        lastModified: today,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    } else {
      entries.push({
        url: `${baseUrl}/blog/post/${entry.slug}`,
        lastModified: today,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      });
    }
  }

  return entries;
}
