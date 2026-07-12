import Link from "next/link";
import { Button } from "@tradehubuae/ui";

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Upgrade?</h2>
        <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
          Browse thousands of products at competitive prices. Free delivery across Dubai and the UAE.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/categories" className="w-full sm:w-auto">
            <Button size="xl" className="w-full sm:w-auto">Browse Products</Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button size="xl" variant="outline" className="w-full sm:w-auto">Contact Us</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
