import ComboOfferForm from "../combo-offer-form";

export default function NewComboOfferPage() {
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>New Combo Offer</h1>
      <div className="rounded-xl border border-line bg-white">
        <div className="p-4 sm:p-6">
          <ComboOfferForm />
        </div>
      </div>
    </div>
  );
}
