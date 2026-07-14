"use client";

export default function CustomersPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between sm:mb-8">
        <div>
          <h1 className="text-lg font-semibold text-ink sm:text-2xl" style={{ letterSpacing: "-0.01em" }}>Customers</h1>
          <p className="mt-0.5 text-xs text-ink-2 sm:text-sm">View and manage your customer base</p>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-line bg-white p-12">
        <div className="text-center">
          <p className="text-sm font-medium text-ink-2">Customer API not yet available</p>
          <p className="mt-1 text-xs text-ink-3">Customers will appear once the backend module is deployed.</p>
        </div>
      </div>
    </div>
  );
}
