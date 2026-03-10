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
  setTest,
  heroTitle,
}: {
  product: IProduct | Diet;
  setTest: (product: IProduct | Diet) => void | Promise<void>;
  heroTitle?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isImageOpen, setImageOpen] = useState(false);
  const imageService =
    "images" in product
      ? product
      : { images: [{ src: product.image || "/logoNew.png" }] };

  return (
    <>
      {/* Product Popup */}
      <AnimatePresence>
        <>
          {/* Popup Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="flex justify-center w-full z-50 overflow-hidden"
          >
            <div className=" w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden relative">
              {/* Content */}
              <div className="h-full overflow-y-auto">
                {/* Hero Section */}
                <ProductDetails
                  product={product}
                  setTest={setTest}
                  heroTitle={heroTitle}
                />
              </div>
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    </>
  );
}
