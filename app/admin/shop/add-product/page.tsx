import ProductEditor from "./ProductEditor";

export default async function Page() {
  return (
    <ProductEditor
      productData={{
        title: "",
        images: [],
        tags: [],
        price: 0,
        description: "",
        mainImage: "",
        questions: [],
        id: "",
      }}
      isEdit={false}
      setCurrentlyEditingProduct={null}
      setProducts={null}
    />
  );
}
