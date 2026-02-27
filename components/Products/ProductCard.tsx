import Image from "next/image";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import { Diet, IProduct } from "@/types";

export default function ProductCard({
  setOpenedProduct,
  product,
}: {
  setOpenedProduct: React.Dispatch<
    React.SetStateAction<IProduct | Diet | null>
  >;
  product: IProduct | Diet;
}) {
  const imageSrc =
    "mainImage" in product
      ? product.mainImage || product.images[0]?.src || "/logo.png"
      : product.image;

  return (
    <div
      className="group relative cursor-pointer"
      onClick={() => setOpenedProduct(product)}
    >
      <div className="h-[500px]">
        <div className="h-full w-full relative">
          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center">
            {/* Product Image */}
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black/50 group-hover:bg-black/80 duration-100 rounded-lg z-[10]">
                <div className="flex items-center justify-center h-full">
                  <span className="text-white text-2xl font-bold">
                    {product.title}
                  </span>
                </div>
              </div>
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Hover overlay */}
            <div className="absolute z-[20] transition-opacity bottom-0 left-0 duration-300 flex items-center justify-center w-full">
              <span className="px-6 py-3 bg-gradient-to-r from-green-700 to-teal-700 text-white rounded-t-xl font-semibold shadow-lg group-hover:bg-green-800 group-hover:to-teal-800 duration-100">
                Zobacz więcej
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
