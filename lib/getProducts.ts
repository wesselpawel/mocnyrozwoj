"use server";
import { getDocuments } from "@/firebase";
import { Diet } from "@/types";

export async function getProducts(): Promise<Diet[]> {
  const products = await getDocuments("products");
  return products as Diet[];
}
