export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Share2, RotateCcw, CheckCircle2, ShieldCheck, Gift } from "lucide-react";
import { WishlistButton } from "@/components/products/WishlistButton";
import { ChatProductButton } from "@/components/chat/ChatProductButton";
import { fetchProductBySlug, fetchProducts, fetchComboOffers } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { ProductRow } from "@/components/home";
import { BuyButtons } from "@/components/products/BuyButtons";
import { ProductGallery } from "@/components/products/ProductGallery";
import { SellerCard } from "@/components/products/SellerCard";
import { SpecsTable } from "@/components/products/SpecsTable";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) {
    return {
      title: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    };
  }
  return {
    title: `${product.name} | TradeHub UAE`,
    description: `View product details for ${product.name} at TradeHub UAE`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const productName = product.name;
  const relatedRes = await fetchProducts({
    category: product.categorySlug,
    limit: 7,
  });
  const relatedProducts = relatedRes.products.filter((p) => p.slug !== slug).slice(0, 6);
  const comboOffers = await fetchComboOffers();
  const matchingCombos = comboOffers.filter((c) =>
    c.items.some((i) => i.slug === slug),
  );

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-28 md:px-6 md:pb-28">
      <div className="py-3 md:py-4">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: product.categoryName, href: `/categories/${product.categorySlug}` },
            { label: productName },
          ]}
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl font-semibold leading-6 text-ink md:text-2xl md:leading-7" style={{ letterSpacing: "-0.01em" }}>
          {productName}
        </h1>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <ChatProductButton product={product} variant="icon" />
          <button type="button" aria-label="Share" className="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:bg-bg3">
            <Share2 className="h-4 w-4" strokeWidth={1.75} />
          </button>
          <WishlistButton slug={product.slug} />
        </div>
      </div>

      <div className="mt-4 grid md:grid-cols-[1fr_360px] md:gap-4">
        <div>
          <ProductGallery badge={product.badge} images={product.images} />

          {product.specs && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.specs.split(" · ").map((item) => (
                <span key={item} className="rounded-lg bg-bg2 px-3 py-1.5 text-xs font-medium text-ink-2">
                  {item}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-ink">Description</h2>
              {product.description ? (
                <p className="mt-1.5 text-sm leading-6 text-ink-2">{product.description}</p>
              ) : (
                <p className="mt-1.5 text-sm leading-6 text-ink-3 italic">No description provided</p>
              )}
            </div>

            <div>
              <h2 className="text-base font-semibold text-ink">Key specifications</h2>
              <div className="mt-2">
                <SpecsTable specs={product.detailedSpecs ?? []} />
              </div>
            </div>

            <div>
              <h2 className="text-base font-semibold text-ink">Condition</h2>
              <div className="mt-2 rounded-xl border border-line p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={2} />
                  <div>
                    <p className="text-sm font-semibold text-ink">Second-hand · Good condition</p>
                    <p className="mt-0.5 text-xs leading-5 text-ink-2">
                      Pre-owned item in good working condition. May show minor signs of use. Fully tested before listing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:sticky md:top-24 md:self-start">
          <div className="rounded-xl border border-line bg-white p-5 shadow-panel">
            <div className="rounded-lg bg-bg2 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-2.5 w-2.5 rounded-full ${!product.stock || product.stock === 0 ? "bg-sale" : product.stock <= 3 ? "bg-amber-500" : "bg-green-500"}`} />
                  <span className="text-sm font-medium text-ink">
                    {!product.stock || product.stock === 0
                      ? "Out of stock"
                      : product.stock <= 3
                        ? `Only ${product.stock} left`
                        : "In stock"}
                  </span>
                </div>
                {product.stock !== undefined && product.stock > 0 && (
                  <span className="text-base font-bold text-ink">
                    {product.stock.toLocaleString()}
                  </span>
                )}
              </div>
              {product.stock !== undefined && product.stock > 0 && (
                <p className="mt-0.5 text-[11px] text-ink-2">
                  {product.stock === 1
                      ? "Last item in stock"
                      : `${product.stock} units ready to ship`}
                </p>
              )}
            </div>

            <div className="mt-2">
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-xs text-ink-3 line-through">AED {product.originalPrice.toLocaleString()}</p>
              )}
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold text-ink">AED {product.price.toLocaleString()}</p>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="rounded bg-sale/10 px-1.5 py-0.5 text-[10px] font-semibold text-sale">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-xs text-ink-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-3.5 w-3.5 text-ink" strokeWidth={1.75} />
                7-day returns
              </div>
            </div>

            <div className="mt-3">
              <BuyButtons product={product} />
            </div>
          </div>

          <div className="mt-4">
            <SellerCard product={product} />
          </div>

          {matchingCombos.length > 0 && (
            <div className="mt-4 rounded-xl border border-line p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <Gift className="h-4 w-4 text-brand" strokeWidth={1.75} />
                <span className="text-[10px] font-bold uppercase tracking-[0.04em] text-ink-2">Available in combos</span>
              </div>
              <div className="space-y-2">
                {matchingCombos.map((combo) => (
                  <Link
                    key={combo.id}
                    href="/combo-offers"
                    className="flex items-center justify-between rounded-lg bg-bg2 px-3 py-2 transition-colors hover:bg-bg3"
                  >
                    <div>
                      <p className="text-xs font-semibold text-ink">{combo.name}</p>
                      <p className="text-[11px] text-ink-2">AED {combo.price.toLocaleString()}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-brand">-{combo.savingsPercent}%</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-line p-4">
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={1.75} />
            <div>
              <p className="text-xs font-semibold text-ink">Secure checkout</p>
              <p className="mt-0.5 text-xs text-ink-2">SSL encrypted · PayPal & card accepted</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-line p-4 md:hidden">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" strokeWidth={1.75} />
          <div>
            <p className="text-xs font-semibold text-ink">Secure checkout</p>
            <p className="mt-0.5 text-xs text-ink-2">SSL encrypted · PayPal & card accepted</p>
          </div>
        </div>
      </div>

      

      {relatedProducts.length > 0 && (
        <div className="mt-12 border-t border-line pt-12">
          <ProductRow
            title={`More in ${product.categoryName}`}
            products={relatedProducts}
            href={`/categories/${product.categorySlug}`}
          />
        </div>
      )}
    </div>
  );
}
