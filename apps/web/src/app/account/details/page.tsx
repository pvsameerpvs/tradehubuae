"use client";

import { Button } from "@tradehubuae/ui";

export default function AccountDetails() {
  return (
    <div className="rounded-xl border border-line bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-ink sm:text-base">Account Details</h2>
        <p className="mt-1 text-sm text-ink-2">Update your personal information</p>
      </div>
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">First Name</label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              defaultValue="Ahmed"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Last Name</label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              defaultValue="Al Maktoum"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Email</label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              defaultValue="ahmed@example.com"
              type="email"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Phone</label>
            <input
              className="mt-1.5 flex h-11 w-full rounded-lg border border-line bg-white px-4 text-sm text-ink placeholder:text-ink-3 transition-colors focus-visible:outline-2 focus-visible:outline-ink/40 focus-visible:outline-offset-2 sm:h-12 sm:text-base"
              defaultValue="+971 50 123 4567"
              type="tel"
            />
          </div>
        </div>
        <div className="pt-1 sm:pt-2">
          <Button size="default" className="h-11 text-sm sm:h-12 sm:text-base">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
