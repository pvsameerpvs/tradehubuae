import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, Badge, Card, CardContent } from "@tradehubuae/ui";
import { ImageIcon, Heart } from "@/components/icons";
import { defaultSpecs, productReviews } from "@/data";
import { Breadcrumb } from "@/components/shared/Breadcrumb";
import { StarRating } from "@/components/shared/StarRating";

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
  const productName = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: "Laptops", href: "/categories/laptops" },
          { label: productName },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="flex aspect-square items-center justify-center rounded-xl bg-muted">
            <ImageIcon className="h-24 w-24 text-muted-foreground" strokeWidth={1} />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 w-20 shrink-0 cursor-pointer rounded-lg border-2 bg-muted transition hover:border-primary" />
            ))}
          </div>
        </div>

        <div>
          <Badge variant="success" className="mb-3">In Stock</Badge>
          <h1 className="mb-2 text-3xl font-bold">{productName}</h1>
          <div className="mb-4 flex items-center gap-2">
            <StarRating rating={5} />
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
          </div>
          <p className="mb-6 text-3xl font-bold text-primary">AED 5,499</p>
          <p className="mb-6 text-muted-foreground">
            Experience unparalleled performance with the latest {productName}. Perfect for professionals, creators, and power users who demand the best.
          </p>

          <div className="mb-6 space-y-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Quantity</label>
              <div className="flex w-32 items-center rounded-md border">
                <button className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:bg-accent">-</button>
                <span className="flex h-11 w-12 items-center justify-center text-sm font-medium">1</span>
                <button className="flex h-11 w-11 items-center justify-center text-muted-foreground hover:bg-accent">+</button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button size="xl" className="flex-1 whitespace-nowrap">Add to Cart</Button>
            <Button size="xl" variant="outline" className="shrink-0">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="mb-4 font-semibold">Key Specifications</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {defaultSpecs.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b pb-1 text-sm">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {productReviews.map((review) => (
            <div key={review.name} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-sm font-medium">{review.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
