import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import type { Product } from "@/data";

const COLUMN_COUNTS = {
  wide: "xl:grid-cols-7",
  desktop: "lg:grid-cols-6",
  laptop: "md:grid-cols-4",
  tablet: "sm:grid-cols-3",
  mobile: "grid-cols-2",
};

export function ProductRow({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
          >
            Show more
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>
      <div className={`grid gap-4 sm:gap-5 ${COLUMN_COUNTS.mobile} ${COLUMN_COUNTS.tablet} ${COLUMN_COUNTS.laptop} ${COLUMN_COUNTS.desktop} ${COLUMN_COUNTS.wide}`}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}

export function ProductRowScroll({
  title,
  products,
  href,
}: {
  title: string;
  products: Product[];
  href?: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2"
          >
            Show more
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        )}
      </div>
      <div className="-mx-6 overflow-x-auto px-6 md:-mx-10 md:px-10 lg:-mx-20 lg:px-20">
        <div className="flex gap-4" style={{ minWidth: "max-content" }}>
          {products.map((product) => (
            <div key={product.slug} className="w-[200px] flex-shrink-0 sm:w-[220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
