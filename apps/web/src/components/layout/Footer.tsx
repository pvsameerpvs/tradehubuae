import Link from "next/link";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Combo Offers", href: "/combo-offers" },
      { label: "Bulk Sales", href: "/bulk-sales" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Track Order", href: "/track-order" },
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Compare Products", href: "/compare" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-primary">TradeHub UAE</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted source for premium IT equipment in the United Arab Emirates. New & refurbished laptops, desktops, gaming PCs, and networking solutions.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="mb-3 font-semibold">{section.title}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TradeHub UAE. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Dubai, UAE</span>
            <a href="mailto:sales@tradehubuae.com" className="hover:text-primary">sales@tradehubuae.com</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
