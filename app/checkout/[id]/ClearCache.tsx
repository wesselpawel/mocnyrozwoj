"use client";
import { addDocument, updateDocument } from "@/firebase";
import { useEffect } from "react";
import { useSelector } from "react-redux";
export default function ClearCache({
  order,
  price,
}: {
  order: any;
  price: any;
}) {
  const cart = useSelector((state: any) => state.shop.cart);
  useEffect(() => {
    addDocument("orders", order.id, {
      ...order,
      creationTime: Date.now(),
      price: price,
    });
    cart.forEach((product: any) => {
      // Assuming you have a function to update the product by id
      updateDocument(["sold"], [true], "products", product.id);
    });
    window.localStorage.clear();
  }, []);
  return <div></div>;
}
