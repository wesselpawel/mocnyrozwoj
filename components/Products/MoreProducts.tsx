import Image from "next/image";
import { useMemo } from "react";
import { getPolishCurrency } from "@/lib/getPolishCurrency";
import { updateDocument } from "@/firebase";
import { Diet, IProduct } from "@/types";

export default function MoreProducts({
  product,
  products,
  setOpenedProduct,
  setTest,
}: {
  product: IProduct | Diet;
  products: (IProduct | Diet)[];
  setOpenedProduct: React.Dispatch<
    React.SetStateAction<IProduct | Diet | null>
  >;
  setTest: (product: IProduct | Diet) => void | Promise<void>;
}) {
  const displayedProducts = useMemo(() => {
    return [...products]
      .filter((item) => item.id !== product.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
  }, [products]);

  return (
    <div className="pb-6">
      <h3 className="mt-8 text-black text-lg sm:text-xl xl:text-2xl text-center lg:text-left font-bold flex flex-row items-center">
        Wypróbuj inne testy
      </h3>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {displayedProducts?.map((item: IProduct | Diet, i: number) => (
          <div
            className={`${item.title === product.title && "hidden"}`}
            key={item.title}
          >
            <button
              key={i}
              onClick={async () => {
                setOpenedProduct(null); // Close current product preview
                await setTest(item); // Start new test and increment clickCount
                // Increment clickCount in the database
                try {
                  await updateDocument(
                    ["clickCount"],
                    [(item.clickCount || 0) + 1],
                    "products",
                    item.id
                  );
                } catch {
                  // Failed to increment clickCount
                }
              }}
              className="flex flex-col relative overflow-hidden rounded-2xl group drop-shadow-sm shadow-black"
            >
              <div className="absolute z-[5] inset-0 bg-gradient-to-t from-black/30 to-black/70 group-hover:from-black/50 group-hover:to-black/50" />
              <div className="absolute z-[6] inset-0 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="font-cardo text-white font-bold line-clamp-2">
                    {item.title}
                  </h2>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl">
                {(() => {
                  const imageSrc =
                    "mainImage" in item
                      ? item.mainImage || item.images[0]?.src || "/logo.png"
                      : item.image;
                  return (
                <Image
                  width={800}
                  height={800}
                  src={imageSrc}
                  alt={item.title}
                  className="w-full h-full group-hover:scale-110 duration-1000 group-hover:rotate-3"
                />
                  );
                })()}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
