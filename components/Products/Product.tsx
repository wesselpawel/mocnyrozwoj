"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Viewer from "@/components/Viewer";
import ProjectImages from "../ProjectImages";
import ProductCard from "./ProductCard";
import ProductNavigation from "./ProductNavigation";
import Disclaimer from "./Disclaimer";
import ProductDetails from "./ProductDetails";
import MoreProducts from "./MoreProducts";
import { polishToEnglish } from "@/lib/polishToEnglish";
import { Diet, IProduct } from "@/types";

export default function Product({
  product,
  products,
  openedProduct,
  setOpenedProduct,
  setTest,
}: {
  product: IProduct | Diet;
  products: (Diet | IProduct)[];
  openedProduct: IProduct | Diet | null;
  setOpenedProduct: React.Dispatch<
    React.SetStateAction<IProduct | Diet | null>
  >;
  setTest: (product: IProduct | Diet) => void | Promise<void>;
}) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isImageOpen, setImageOpen] = useState(false);

  return (
    <>
      <ProjectImages
        service={product}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        setImageOpen={setImageOpen}
        isImageOpen={isImageOpen}
      />
      <ProductCard setOpenedProduct={setOpenedProduct} product={product} />

      {/* Product Popup */}
      <AnimatePresence>
        {openedProduct?.id === product.id && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setOpenedProduct(null)}
            />

            {/* Popup Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-4 lg:inset-8 z-50 overflow-hidden"
            >
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Close Button */}
                <button
                  onClick={() => setOpenedProduct(null)}
                  className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Content */}
                <div className="h-full overflow-y-auto">
                  {/* Hero Section */}
                  <ProductDetails product={product} setTest={setTest} />

                  {/* Details Section */}
                  <div className="px-6 lg:px-12 py-8 bg-gradient-to-br from-gray-50 to-white">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="max-w-4xl mx-auto"
                    >
                      {/* Description */}
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">
                          O planie dietetycznym
                        </h3>
                        <div className="prose prose-lg max-w-none">
                          <Viewer value={product.description} />
                        </div>
                      </div>

                      {/* Tags */}
                      {product?.tags && product.tags.length > 0 && (
                        <div className="mb-8">
                          <h4 className="text-lg font-semibold text-gray-800 mb-3">
                            Tagi
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
                              >
                                #{polishToEnglish(tag)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Disclaimer */}
                      <div className="mb-8">
                        <Disclaimer />
                      </div>

                      {/* More Products */}
                      <div className="mb-8">
                        <MoreProducts
                          setOpenedProduct={setOpenedProduct}
                          setTest={setTest}
                          products={products}
                          product={product}
                        />
                      </div>

                      {/* Navigation */}
                      <div className="mb-8">
                        <ProductNavigation
                          setOpenedProduct={setOpenedProduct}
                        />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
