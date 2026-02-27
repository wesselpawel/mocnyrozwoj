"use client";
import { addDocument, updateDocument } from "@/firebase";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface OrderMetadata {
  id: string;
  [key: string]: unknown;
}

interface CartProduct {
  id: string;
  [key: string]: unknown;
}

interface ShopState {
  shop: { cart: CartProduct[] };
}

export default function ClearCache({
  order,
  price,
}: {
  order: OrderMetadata;
  price: number;
}) {
  const cart = useSelector((state: ShopState) => state.shop.cart);
  useEffect(() => {
    addDocument("orders", order.id, {
      ...order,
      creationTime: Date.now(),
      price: price,
    });
    cart.forEach((product: CartProduct) => {
      // Assuming you have a function to update the product by id
      updateDocument(["sold"], [true], "products", product.id);
    });
    window.localStorage.clear();
  }, []);
  return <div></div>;
}
