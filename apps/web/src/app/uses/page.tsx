import Link from "next/link";
import type { Metadata } from "next";
import { fetchUses } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";

export const metadata: Metadata = {
  title: "Shop by Use | TradeHub UAE",
  description: "Browse laptops, phones, and tech by use case — Gaming, Office, Student, Content Creation, Business, and more at TradeHub UAE.",
};

export default async function UsesPage() {
  const uses = await fetchUses();

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10 lg:px-20">
      <div className="pb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Shop by Use" },
          ]}
        />
      </div>

      <div className="border-b border-line pb-8">
        <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          Shop by Use
        </h1>
        <p className="mt-1.5 text-[14px] leading-[18px] text-ink-2">
          Find exactly what you need — browse by how you&apos;ll use it
        </p>
      </div>

      <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {uses.map((useItem) => (
          <Link
            key={useItem.slug}
            href={`/uses/${useItem.slug}`}
            className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl bg-bg2 transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ aspectRatio: "4/3" }}
          >
            {useItem.image && (
              <img
                src={useItem.image}
                alt={useItem.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="relative z-10 mb-5 w-[calc(100%-40px)] rounded-xl bg-white/95 px-5 py-3 text-center backdrop-blur-sm">
              <p className="text-base font-semibold text-ink" style={{ letterSpacing: "-0.01em" }}>
                {useItem.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
