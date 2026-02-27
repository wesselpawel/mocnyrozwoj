import AdminProducts from "./AdminProducts";
import { getShopProducts } from "@/lib/getShopProducts";
export const dynamic = "force-dynamic";
export default async function Page() {
  const products = await getShopProducts();
  return (
    <div className="p-6 lg:p-16">
      <h1 className="text-3xl font-cardo text-black">Produkty</h1>
      <AdminProducts productData={products} />
    </div>
  );
}
