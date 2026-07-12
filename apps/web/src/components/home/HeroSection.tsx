import Link from "next/link";
import { Button } from "@tradehubuae/ui";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-20 dark:from-blue-950/20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
          Premium IT Equipment in the UAE
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Discover the best deals on new and refurbished laptops, desktops, gaming PCs,
          components, and networking equipment. Trusted by businesses across the UAE.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
          <Link href="/search" className="w-full sm:w-auto">
            <Button size="xl" className="w-full sm:w-auto">Shop Now</Button>
          </Link>
          <Link href="/bulk-sales" className="w-full sm:w-auto">
            <Button size="xl" variant="outline" className="w-full sm:w-auto">Bulk Inquiry</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
