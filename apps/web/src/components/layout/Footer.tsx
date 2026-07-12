import Link from "next/link";
import Image from "next/image";

const footerColumns = [
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
    <footer className="border-t border-line bg-bg2">
      <div className="mx-auto max-w-[1760px] px-6 py-12 md:px-10 lg:px-20">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/logo-web.png"
                alt="TradeHub UAE"
                width={137}
                height={40}
                priority
              />
            </Link>
            <p className="text-sm text-ink-2 leading-relaxed">
              Your trusted source for premium IT equipment in the United Arab Emirates. New & refurbished laptops, desktops, gaming PCs, and networking solutions.
            </p>
          </div>
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h4 className="mb-4 text-sm font-semibold text-ink">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-2 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 md:flex-row">
          <p className="text-sm text-ink-2">
            &copy; {new Date().getFullYear()} TradeHub UAE. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-ink-2">
            <span>Dubai, UAE</span>
            <span className="text-line">|</span>
            <a href="mailto:sales@tradehubuae.com" className="hover:text-ink transition-colors">
              sales@tradehubuae.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
