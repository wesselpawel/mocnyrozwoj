"use client";
import Image from "next/image";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import ProductEditor from "../add-product/ProductEditor";
import { removeDocument } from "@/firebase";
import { toast } from "react-toastify";
import { IProduct } from "@/types";

export default function AdminProducts({
  productData,
}: {
  productData: IProduct[];
}) {
  const [products, setProducts] = useState(productData);
  const [currentlyEditingProduct, setCurrentlyEditingProduct] =
    useState<IProduct | null>(null);
  const [currentlyDeletingProduct, setCurrentlyDeletingProduct] =
    useState<IProduct | null>(null);
  return (
    <>
      {currentlyDeletingProduct && (
        <div
          onClick={() => setCurrentlyDeletingProduct(null)}
          className="font-ubuntu z-[150] fixed left-0 top-0 w-screen h-screen overflow-y-scroll flex items-center justify-center bg-black/50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 h-max w-[30rem] md:w-[35rem]"
          >
            <h3 className="text-3xl">Usuń obraz</h3>
            <h2 className="">
              Czy na pewno chcesz usunąć{" "}
              <span className="text-red-500 font-bold">
                {currentlyDeletingProduct?.title}
              </span>
              ?
            </h2>
            <div className="grid grid-cols-2 mt-4">
              <button
                onClick={() => setCurrentlyDeletingProduct(null)}
                className="bg-gray-200 hover:bg-gray-300 duration-300 px-4 py-2 mr-4"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  removeDocument("products", currentlyDeletingProduct.id);
                  setProducts((prev: IProduct[]) =>
                    prev.filter(
                      (item) => item.id !== currentlyDeletingProduct.id
                    )
                  );
                  toast.success("Usunięto obraz pomyślnie!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                  });
                  setCurrentlyDeletingProduct(null);
                }}
                className="text-white bg-red-500 hover:bg-red-600 duration-300 px-4 py-2 font-bold"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
      {currentlyEditingProduct && (
        <div
          onClick={() => setCurrentlyEditingProduct(null)}
          className="z-[150] fixed left-0 top-0 w-screen h-screen overflow-y-scroll bg-black/50 p-0 lg:p-24"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ProductEditor
              productData={currentlyEditingProduct}
              setCurrentlyEditingProduct={setCurrentlyEditingProduct}
              setProducts={setProducts}
              isEdit
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {products &&
          products.map((product: IProduct) => (
            <div key={product.title} className="relative">
              <div
                className={`font-ubuntu absolute bottom-0 left-0 w-full h-12 text-white grid grid-cols-2`}
              >
                <button
                  onClick={() => setCurrentlyEditingProduct(product)}
                  className="bg-black/70 hover:bg-black/80 duration-300 flex flex-col items-center justify-center text-center h-full"
                >
                  <FaEdit />

                  <p className="text-xs mt-1">EDYTUJ</p>
                </button>
                <button
                  onClick={() => setCurrentlyDeletingProduct(product)}
                  className="bg-black/70 hover:bg-black/80 duration-300 flex flex-col items-center justify-center text-center h-full"
                >
                  <FaTrash />
                  <p className="text-xs mt-1">USUŃ</p>
                </button>
              </div>
              <Image
                width={1024}
                height={1024}
                src={product.mainImage || product.images[0].src}
                className="border border-gray-200"
                alt={product?.title}
              />
              <div className="absolute top-2 left-2 bg-white/80 text-black text-xs px-2 py-1 rounded shadow">
                Kliknięcia: {product.clickCount || 0}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
