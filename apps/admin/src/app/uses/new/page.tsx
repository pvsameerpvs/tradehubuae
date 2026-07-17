import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UseForm } from "../use-form";

export default function NewUsePage() {
  return (
    <div>
      <Link href="/uses" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-2 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to Uses
      </Link>
      <h1 className="mb-6 text-lg font-semibold text-ink sm:mb-8 sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>New Use</h1>
      <div className="rounded-xl border border-line bg-white">
        <div className="p-4 sm:p-6">
          <UseForm />
        </div>
      </div>
    </div>
  );
}
