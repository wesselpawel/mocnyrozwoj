"use client";
import Product from "./Product";
import { Suspense, useState, useEffect } from "react";
import Test from "./Test";
import { IProduct, Diet } from "@/types";
import { updateDocument } from "@/firebase";
import { dietService } from "@/lib/dietService";

export default function Products({ products }: { products: (IProduct | Diet)[] }) {
  const [openedProduct, setOpenedProduct] = useState<IProduct | Diet | null>(null);
  const [test, setTest] = useState<IProduct | Diet | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Wszystkie");
  const [categories, setCategories] = useState<string[]>(["Wszystkie"]);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await dietService.getDietCategories();
        setCategories(["Wszystkie", ...fetchedCategories]);
      } catch {
        // Failed to fetch categories
      }
    };

    fetchCategories();
  }, []);

  // Handle escape key to close test
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && test) {
        setTest(null);
      }
    };

    if (test) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [test]);

  // When a test is opened, dispatch a global event and increment clickCount
  const handleOpenTest = async (product: IProduct | Diet) => {
    setTest(product); // This only sets the state
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("test-popup-opened", { detail: { test: product } })
      );
    }
    // Increment clickCount in the database
    try {
      await updateDocument(
        ["clickCount"],
        [(("clickCount" in product ? product.clickCount : undefined) ?? 0) + 1],
        "products",
        product.id
      );
    } catch {
      // Failed to increment clickCount
    }
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "Wszystkie"
      ? products
      : products.filter(
          (product: IProduct | Diet) =>
            "category" in product && product.category === selectedCategory,
        );

  if (!isClient) {
    return null;
  }

  return (
    <div className="mx-5 lg:mx-[8vw] xl:mx-[12vw]">
      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Test Modal */}
      {test && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setTest(null)}
          />
          <div className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl">
            <Test setTest={setTest} test={test} />
          </div>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: IProduct | Diet, i: number) => (
              <Product
                product={product}
                key={i}
                products={products}
                openedProduct={openedProduct}
                setOpenedProduct={setOpenedProduct}
                setTest={handleOpenTest}
              />
            ))
          ) : (
            <div className="col-span-full p-4 bg-gray-200">Brak wyników...</div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
