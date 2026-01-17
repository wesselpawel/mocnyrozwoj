import { FaLongArrowAltLeft } from "react-icons/fa";
import { Diet, IProduct } from "@/types";

export default function ProductNavigation({
  setOpenedProduct,
}: {
  setOpenedProduct: React.Dispatch<
    React.SetStateAction<IProduct | Diet | null>
  >;
}) {
  return (
    <div className="z-[102] sticky bottom-0 left-0 w-full h-12 bg-gray-700 text-gray-200 rounded-t-xl grid grid-cols-3">
      <button
        onClick={() => setOpenedProduct(null)}
        className="flex flex-col items-center justify-center text-xs"
      >
        <FaLongArrowAltLeft className="text-lg" />
        Powrót
      </button>
    </div>
  );
}
