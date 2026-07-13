import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Heart, Share2, ShieldCheck, Truck, RotateCcw, Star, ChevronRight, MapPin, Building2, MessageSquare, CheckCircle2 } from "lucide-react";
import { searchProducts, defaultSpecs, productReviews } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { StarRating } from "@/components/shared/StarRating";
import { ProductRow } from "@/components/home";
import { BuyButtons } from "@/components/products/BuyButtons";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: `View product details for ${slug.replace(/-/g, " ")} at TradeHub UAE`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = searchProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const productName = product.name;
  const relatedProducts = searchProducts.filter((p) => p.category === product.category && p.slug !== slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-[1120px] px-6 pb-24 md:pb-16">
      <div className="py-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: product.category, href: `/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}` },
            { label: productName },
          ]}
        />
      </div>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[26px] font-semibold leading-[30px] text-ink" style={{ letterSpacing: "-0.01em" }}>
            {productName}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-ink-2">
            <StarRating rating={Math.floor(product.rating ?? 4)} />
            <span className="font-medium text-ink">{product.rating}</span>
            <span>({product.reviewCount ?? 0} reviews)</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Share" className="flex h-10 w-10 items-center justify-center text-ink hover:text-ink/70">
            <Share2 className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button type="button" aria-label="Save" className="flex h-10 w-10 items-center justify-center text-ink hover:text-ink/70">
            <Heart className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[62%_1fr] md:gap-10">
        <div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 aspect-[4/3] rounded-xl bg-bg2" />
            <div className="aspect-square rounded-xl bg-bg2" />
            <div className="aspect-square rounded-xl bg-bg2" />
            <div className="aspect-square rounded-xl bg-bg2" />
            <div className="aspect-square rounded-xl bg-bg2" />
          </div>

          <div className="mt-10 space-y-10">
            <section>
              <h2 className="mb-4 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                Description
              </h2>
              <p className="text-base leading-6 text-ink-2">
                Experience unparalleled performance with the {productName}. Perfect for professionals, creators, and power users who demand the best. This expertly crafted machine delivers exceptional speed, stunning visuals, and all-day battery life.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                Meet your seller
              </h2>
              <div className="flex items-center gap-4 rounded-xl border border-line p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg2 text-lg font-semibold text-ink">
                  TH
                </div>
                <div>
                  <p className="font-semibold text-ink">TradeHub UAE</p>
                  <p className="mt-0.5 text-sm text-ink-2">Dubai, UAE · 1,200+ sales</p>
                  <div className="mt-1 flex items-center gap-1 text-sm text-ink">
                    <Star className="h-3.5 w-3.5 fill-ink text-ink" strokeWidth={0} />
                    4.9 average · 327 reviews
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                What we love
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ShieldCheck, text: "Certified refurbished — tested and guaranteed" },
                  { icon: Truck, text: "Free delivery across Dubai & UAE" },
                  { icon: RotateCcw, text: "14-day return policy, no questions asked" },
                  { icon: MapPin, text: "Visit our showroom in Dubai Silicon Oasis" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-ink" strokeWidth={1.75} />
                    <span className="text-sm text-ink-2">{item.text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                Key specifications
              </h2>
              <div className="rounded-xl border border-line divide-y divide-line">
                {defaultSpecs.map((spec) => (
                  <div key={spec.label} className="flex justify-between px-5 py-3 text-sm">
                    <span className="text-ink-2">{spec.label}</span>
                    <span className="font-medium text-ink">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                Condition
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-xl border border-line p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand" strokeWidth={1.75} />
                  <div>
                    <p className="font-semibold text-ink">Certified Refurbished</p>
                    <p className="mt-0.5 text-sm text-ink-2">Professionally inspected, cleaned, and tested. Includes 2-year warranty. Battery replaced if below 85% capacity.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-semibold leading-[26px] text-ink" style={{ letterSpacing: "-0.01em" }}>
                  Reviews
                </h2>
                <Link href="#" className="flex items-center gap-1 text-sm font-semibold text-ink underline underline-offset-2">
                  All reviews
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {productReviews.map((review) => (
                  <div key={review.name} className="rounded-xl border border-line p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-semibold text-ink">{review.name}</span>
                    </div>
                    <p className="text-sm text-ink-2">{review.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="md:sticky md:top-28 md:self-start">
          <div className="rounded-xl border border-line bg-white p-6 shadow-panel">
            <div className="mb-4">
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-ink-3 line-through">{product.originalPrice.toLocaleString()} AED</p>
              )}
              <p className="text-[26px] font-semibold leading-[30px] text-ink">
                {product.price.toLocaleString()} AED
              </p>
            </div>

            <div className="mb-6 space-y-2 text-sm text-ink-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" strokeWidth={1.75} />
                Free delivery in Dubai
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                14-day returns
              </div>
            </div>

            <BuyButtons product={product} />
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-line pt-16">
          <ProductRow
            title={`More in ${product.category}`}
            products={relatedProducts}
            href={`/categories/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
          />
        </div>
      )}

    </div>
  );
}
