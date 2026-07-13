import BrandForm from "../brand-form";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Edit Brand</h1>
      <div className="rounded-xl border border-line bg-white">
        <div className="p-4 sm:p-6">
          <BrandForm id={id} />
        </div>
      </div>
    </div>
  );
}
