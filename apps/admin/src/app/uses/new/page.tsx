import UseForm from "../use-form";

export default function NewUsePage() {
  return (
    <div>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>New Use</h1>
      <div className="rounded-xl border border-line bg-white">
        <div className="p-4 sm:p-6">
          <UseForm />
        </div>
      </div>
    </div>
  );
}
