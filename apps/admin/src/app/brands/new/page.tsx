import BrandForm from "../brand-form";

export default function NewBrandPage() {
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>New Brand</h1>
      <div className="rounded-xl border border-line bg-white">
        <div className="p-4 sm:p-6">
          <BrandForm />
        </div>
      </div>
    </div>
  );
}
