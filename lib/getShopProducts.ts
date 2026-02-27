"use server";
import { getDocuments } from "@/firebase";
import { IProduct } from "@/types";

export async function getShopProducts(): Promise<IProduct[]> {
  const products = await getDocuments("products");
  return products as IProduct[];
}
