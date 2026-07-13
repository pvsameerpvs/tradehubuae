import ProductForm from "../product-form";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>New Product</h1>
      <div className="rounded-xl border border-line bg-white">
        <div className="p-4 sm:p-6">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
