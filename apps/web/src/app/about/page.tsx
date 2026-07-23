import type { Metadata } from "next";
import { organizationSchema } from "@tradehubuae/seo";
import { aboutStats } from "@/data/benefits";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TradeHub UAE - Dubai's premier IT equipment company",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }} />
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold md:text-4xl">About TradeHub UAE</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-ink-2">
            TradeHub UAE is Dubai&apos;s premier destination for IT equipment. We specialize in providing
            high-quality second-hand laptops, desktop PCs, gaming systems, components, and
            networking solutions to customers across the United Arab Emirates.
          </p>
          <p className="mt-4 text-ink-2">
            Founded with a mission to make quality IT equipment accessible and affordable,
            we serve individual customers, businesses, educational institutions, and government
            organizations throughout the UAE and wider GCC region.
          </p>
        </div>

        <div className="my-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {aboutStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-white p-6 text-center">
              <p className="text-3xl font-bold text-brand">{stat.value}</p>
              <p className="mt-1 text-sm text-ink-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Our Mission</h2>
            <p className="text-sm text-ink-2">
              To provide businesses and individuals across the UAE with access to premium IT equipment
              at competitive prices, backed by exceptional customer service and support.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">Our Values</h2>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><strong className="text-ink">Quality:</strong> Every product is verified before listing</li>
              <li><strong className="text-ink">Trust:</strong> Transparent pricing and genuine products</li>
              <li><strong className="text-ink">Speed:</strong> Fast delivery across all emirates</li>
              <li><strong className="text-ink">Support:</strong> Dedicated team for every customer</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
