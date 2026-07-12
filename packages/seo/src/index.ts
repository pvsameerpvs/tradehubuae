import type { Metadata } from "next";
import type { BreadcrumbItem, Slug } from "@tradehubuae/types";

interface SEOInput {
  title: string;
  description: string;
  slug?: Slug;
  noIndex?: boolean;
  canonical?: string;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  type?: "website" | "article" | "product";
}

export function generateMetadata(input: SEOInput, locale: string = "en_AE"): Metadata {
  const siteName = "TradeHub UAE";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tradehubuae.com";
  const url = input.slug ? `${siteUrl}/${input.slug}` : siteUrl;

  return {
    title: `${input.title} | ${siteName}`,
    description: input.description,
    robots: {
      index: !input.noIndex,
      follow: !input.noIndex,
    },
    alternates: {
      canonical: input.canonical ?? url,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName,
      locale,
      type: (input.type ?? "website") as "website" | "article",
      images: input.images?.length
        ? input.images
        : [{ url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }],
      ...(input.publishedTime && { publishedTime: input.publishedTime }),
      ...(input.modifiedTime && { modifiedTime: input.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: input.images?.[0]?.url,
    },
  };
}

export function productSchema(product: {
  name: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
  image?: string;
  brand?: string;
  condition?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.image,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      itemCondition: product.condition
        ? `https://schema.org/${product.condition === "New" ? "NewCondition" : "UsedCondition"}`
        : undefined,
      availability: `https://schema.org/${product.availability ?? "InStock"}`,
      url: product.url,
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TradeHub UAE",
    url: "https://tradehubuae.com",
    logo: "https://tradehubuae.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+971-XXX-XXXX",
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: ["English", "Arabic"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "AE",
    },
    sameAs: [
      "https://facebook.com/tradehubuae",
      "https://instagram.com/tradehubuae",
      "https://linkedin.com/company/tradehubuae",
    ],
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: item.href }),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function articleSchema(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "TradeHub UAE",
    },
  };
}

export function generateSitemapEntry(url: string, priority: number = 0.5, changeFreq: string = "weekly") {
  return {
    url,
    lastModified: new Date().toISOString(),
    changeFrequency: changeFreq,
    priority,
  };
}
