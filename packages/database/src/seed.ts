// @ts-nocheck — Seed file is not subject to strict type checking
import { db } from "./index";
import {
  users, profiles,
} from "./schema/users";
import { addresses } from "./schema/addresses";
import { categories, categoryAttributes } from "./schema/categories";
import { brands } from "./schema/brands";
import { uses } from "./schema/uses";
import { products, productCategories, productImages, productSpecs, productVariants } from "./schema/products";
import { warehouses, stock } from "./schema/inventory";
import { reviews } from "./schema/reviews";
import { blogPosts, blogTags, blogPostTags } from "./schema/blog";
import { coupons } from "./schema/marketing";
import { seoMetadata, redirects } from "./schema/seo";
import { comboOffers, comboOfferItems } from "./schema/marketing";
import { bulkRequests, bulkRequestItems } from "./schema/bulk-sales";

async function seed() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ──
  const tables = [
    "stock", "stock_history", "stock_transfer_items", "stock_transfers",
    "inventory_logs", "warehouses",
    "order_items", "payments", "shipments", "returns", "orders",
    "cart_items", "wishlist_items",
    "reviews",
    "combo_offer_items", "combo_offers",
    "coupon_products", "coupons",
    "blog_post_tags", "blog_post_products", "blog_tags", "blog_posts",
    "seo_metadata", "redirects",
    "notifications",
    "bulk_request_items", "bulk_requests",
    "chat_messages", "chat_sessions",
    "analytics_events", "page_views", "search_logs",
    "product_categories", "product_variants", "product_specs", "product_images", "products",
    "category_attributes", "categories",
    "brands", "uses",
    "addresses", "activity_logs", "sessions", "profiles", "users",
  ];

  for (const t of tables) {
    await db.execute(`DELETE FROM "${t}"`);
  }

  // ── Users ──
  const users_ = await db.insert(users).values({
    email: "admin@tradehubuae.com",
    name: "Admin User",
    password: "$2b$10$placeholder",
    role: "SUPER_ADMIN",
    phone: "+971501234567",
    isActive: true,
    emailVerified: new Date(),
  }).returning();
  const admin = users_[0]!;

  const managers_ = await db.insert(users).values({
    email: "manager@tradehubuae.com",
    name: "Inventory Manager",
    password: "$2b$10$placeholder",
    role: "INVENTORY_MANAGER",
    phone: "+971501234568",
    isActive: true,
    emailVerified: new Date(),
  }).returning();
  const manager = managers_[0]!;

  await db.insert(users).values([
    { email: "customer1@example.com", name: "Ahmed Al Maktoum", role: "CUSTOMER", phone: "+971501234569", isActive: true },
    { email: "customer2@example.com", name: "Fatima Hassan", role: "CUSTOMER", phone: "+971501234570", isActive: true },
  ]);

  // ── Addresses ──
  await db.insert(addresses).values([
    {
      userId: admin.id, firstName: "Admin", lastName: "User",
      phone: "+971501234567", addressLine1: "Dubai Silicon Oasis",
      city: "Dubai", emirate: "Dubai", isDefault: true,
    },
    {
      userId: manager.id, firstName: "Inventory", lastName: "Manager",
      phone: "+971501234568", addressLine1: "Abu Dhabi Industrial City",
      city: "Abu Dhabi", emirate: "Abu Dhabi", isDefault: true,
    },
  ]);

  // ── Uses ──
  const useData = [
    { name: "Data Center", slug: "data-center", image: "/images/uses/data-center.jpg" },
    { name: "Enterprise Networking", slug: "enterprise-networking", image: "/images/uses/enterprise-networking.jpg" },
    { name: "Cloud Computing", slug: "cloud-computing", image: "/images/uses/cloud-computing.jpg" },
    { name: "Cyber Security", slug: "cyber-security", image: "/images/uses/cyber-security.jpg" },
    { name: "Smart Office", slug: "smart-office", image: "/images/uses/smart-office.jpg" },
    { name: "Education", slug: "education", image: "/images/uses/education.jpg" },
    { name: "Healthcare", slug: "healthcare", image: "/images/uses/healthcare.jpg" },
    { name: "Retail & POS", slug: "retail-pos", image: "/images/uses/retail-pos.jpg" },
  ];
  const insertedUses = await db.insert(uses).values(useData).returning();

  // ── Brands ──
  const brandData = [
    { name: "Cisco", slug: "cisco", description: "Networking hardware leader", logo: "/images/brands/cisco.svg", website: "https://cisco.com" },
    { name: "Dell", slug: "dell", description: "Enterprise computing solutions", logo: "/images/brands/dell.svg", website: "https://dell.com" },
    { name: "HP", slug: "hp", description: "Printers, PCs and enterprise IT", logo: "/images/brands/hp.svg", website: "https://hp.com" },
    { name: "HPE", slug: "hpe", description: "Enterprise IT infrastructure", logo: "/images/brands/hpe.svg", website: "https://hpe.com" },
    { name: "Lenovo", slug: "lenovo", description: "PCs, servers and smart devices", logo: "/images/brands/lenovo.svg", website: "https://lenovo.com" },
    { name: "Juniper", slug: "juniper", description: "Networking and cybersecurity", logo: "/images/brands/juniper.svg", website: "https://juniper.net" },
    { name: "Fortinet", slug: "fortinet", description: "Cybersecurity solutions", logo: "/images/brands/fortinet.svg", website: "https://fortinet.com" },
    { name: "Microsoft", slug: "microsoft", description: "Software and cloud services", logo: "/images/brands/microsoft.svg", website: "https://microsoft.com" },
    { name: "VMware", slug: "vmware", description: "Virtualization and cloud", logo: "/images/brands/vmware.svg", website: "https://vmware.com" },
    { name: "Ubiquiti", slug: "ubiquiti", description: "Networking for ISP and enterprise", logo: "/images/brands/ubiquiti.svg", website: "https://ui.com" },
    { name: "APC", slug: "apc", description: "Power protection and cooling", logo: "/images/brands/apc.svg", website: "https://apc.com" },
    { name: "Ruckus", slug: "ruckus", description: "WiFi and switching", logo: "/images/brands/ruckus.svg", website: "https://ruckusnetworks.com" },
    { name: "Palo Alto", slug: "palo-alto", description: "Next-generation firewalls", logo: "/images/brands/paloalto.svg", website: "https://paloaltonetworks.com" },
    { name: "Supermicro", slug: "supermicro", description: "Server and storage solutions", logo: "/images/brands/supermicro.svg", website: "https://supermicro.com" },
    { name: "Synology", slug: "synology", description: "NAS and network storage", logo: "/images/brands/synology.svg", website: "https://synology.com" },
  ];
  const insertedBrands = await db.insert(brands).values(brandData).returning();
  const brandMap = Object.fromEntries(insertedBrands.map(b => [b.slug, b])) as Record<string, typeof insertedBrands[number]>;

  // ── Categories ──
  const catData = [
    { name: "Networking", slug: "networking", description: "Switches, routers, firewalls & wireless", sortOrder: 1, isActive: true },
    { name: "Servers", slug: "servers", description: "Rack, tower and blade servers", sortOrder: 2, isActive: true },
    { name: "Storage", slug: "storage", description: "NAS, SAN and storage arrays", sortOrder: 3, isActive: true },
    { name: "Security", slug: "security", description: "Firewalls, VPN and cybersecurity", sortOrder: 4, isActive: true },
    { name: "Power & Cooling", slug: "power-cooling", description: "UPS, PDU and cooling solutions", sortOrder: 5, isActive: true },
    { name: "Cables & Transceivers", slug: "cables-transceivers", description: "Fiber, copper and optics", sortOrder: 6, isActive: true },
    { name: "Software & Licensing", slug: "software-licensing", description: "OS, virtualization and productivity", sortOrder: 7, isActive: true },
    { name: "Workstations & PCs", slug: "workstations-pcs", description: "Desktop and mobile computing", sortOrder: 8, isActive: true },
  ];
  const insertedCats = await db.insert(categories).values(catData).returning();
  const catMap = Object.fromEntries(insertedCats.map(c => [c.slug, c]));

  // ── Subcategories ──
  const subData = [
    { name: "Switches", slug: "switches", description: "Managed and unmanaged switches", parentId: catMap["networking"].id, sortOrder: 1 },
    { name: "Routers", slug: "routers", description: "Enterprise and edge routers", parentId: catMap["networking"].id, sortOrder: 2 },
    { name: "Wireless", slug: "wireless", description: "Access points and controllers", parentId: catMap["networking"].id, sortOrder: 3 },
    { name: "Firewalls", slug: "firewalls", description: "Next-gen firewalls and UTM", parentId: catMap["security"].id, sortOrder: 1 },
    { name: "Rack Servers", slug: "rack-servers", description: "Standard rackmount servers", parentId: catMap["servers"].id, sortOrder: 1 },
    { name: "Tower Servers", slug: "tower-servers", description: "Standalone tower servers", parentId: catMap["servers"].id, sortOrder: 2 },
    { name: "NAS", slug: "nas", description: "Network attached storage", parentId: catMap["storage"].id, sortOrder: 1 },
    { name: "UPS", slug: "ups", description: "Uninterruptible power supplies", parentId: catMap["power-cooling"].id, sortOrder: 1 },
    { name: "PDU", slug: "pdu", description: "Power distribution units", parentId: catMap["power-cooling"].id, sortOrder: 2 },
  ];
  const insertedSubCats = await db.insert(categories).values(subData).returning();
  const subCatMap = Object.fromEntries(insertedSubCats.map(c => [c.slug, c]));

  // ── Products ──
  const productData = [
    {
      name: "Cisco Catalyst 9300-48P Switch", slug: "cisco-c9300-48p",
      shortDescription: "48-port PoE+ Gigabit Ethernet switch with modular uplinks",
      description: "The Cisco Catalyst 9300 Series switches are the industry's most widely used enterprise switching platform, offering 48 PoE+ ports, 4x10G uplinks, and advanced security features.",
      sku: "C9300-48P", price: "8500.00", compareAtPrice: "9500.00", costPrice: "6200.00",
      brandId: brandMap["cisco"].id, useId: insertedUses[0].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 45, availableStock: 42,
      categorySlugs: ["switches"], weight: "7.2", width: "44.5", height: "4.4", depth: "48.0",
      seoTitle: "Cisco Catalyst 9300-48P PoE+ Switch Dubai | TradeHub UAE",
      seoDescription: "Buy Cisco Catalyst 9300-48P PoE+ switch in UAE. 48 GigE PoE+ ports, modular uplinks, advanced security.",
    },
    {
      name: "Cisco Catalyst 9200-24P Switch", slug: "cisco-c9200-24p",
      shortDescription: "24-port PoE+ Gigabit Ethernet switch",
      description: "Entry-level enterprise switch with 24 PoE+ ports, ideal for branch offices and small deployments.",
      sku: "C9200-24P", price: "4200.00", compareAtPrice: "4800.00", costPrice: "3100.00",
      brandId: brandMap["cisco"].id, useId: insertedUses[1].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 78, availableStock: 75,
      categorySlugs: ["switches"], weight: "5.8", width: "44.5", height: "4.4", depth: "40.0",
    },
    {
      name: "Cisco ISR 4321 Router", slug: "cisco-isr4321",
      shortDescription: "Integrated Services Router for branch connectivity",
      description: "Cisco 4000 Series ISR with 2x GE ports, 2x NIM slots, and advanced routing capabilities.",
      sku: "ISR4321", price: "3200.00", costPrice: "2300.00",
      brandId: brandMap["cisco"].id, useId: insertedUses[1].id, condition: "Used - Excellent",
      isActive: true, isFeatured: false, totalStock: 12, availableStock: 10,
      categorySlugs: ["routers"], weight: "6.2", width: "43.8", height: "4.4", depth: "38.5",
    },
    {
      name: "Dell PowerEdge R750xs Server", slug: "dell-r750xs",
      shortDescription: "2U rack server with dual Xeon Scalable processors",
      description: "The Dell PowerEdge R750xs delivers exceptional performance for mainstream business workloads with 3rd Gen Intel Xeon Scalable processors.",
      sku: "R750XS", price: "18500.00", compareAtPrice: "21000.00", costPrice: "14000.00",
      brandId: brandMap["dell"].id, useId: insertedUses[2].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 25, availableStock: 22,
      categorySlugs: ["rack-servers"], weight: "14.5", width: "48.2", height: "8.6", depth: "73.5",
      seoTitle: "Dell PowerEdge R750xs Server Price UAE | TradeHub",
      seoDescription: "Buy Dell PowerEdge R750xs rack server in Dubai. Dual Xeon Scalable, 16 DIMM slots, enterprise reliability.",
    },
    {
      name: "Dell PowerEdge T550 Tower Server", slug: "dell-t550",
      shortDescription: "Tower server with Xeon Scalable, ideal for SMB",
      description: "Versatile tower server for small and medium businesses with excellent expandability.",
      sku: "T550-TOWER", price: "12000.00", costPrice: "9000.00",
      brandId: brandMap["dell"].id, useId: insertedUses[4].id, condition: "New",
      isActive: true, isFeatured: false, totalStock: 18, availableStock: 16,
      categorySlugs: ["tower-servers"], weight: "18.0", width: "21.3", height: "43.0", depth: "59.0",
    },
    {
      name: "HPE ProLiant DL380 Gen11", slug: "hpe-dl380-gen11",
      shortDescription: "2U rack server with 5th Gen Xeon processors",
      description: "The industry-standard 2U rack server with 5th Gen Intel Xeon Scalable processors, up to 8TB memory, and comprehensive security.",
      sku: "DL380-G11", price: "22000.00", compareAtPrice: "25000.00", costPrice: "16500.00",
      brandId: brandMap["hpe"].id, useId: insertedUses[0].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 30, availableStock: 28,
      categorySlugs: ["rack-servers"], weight: "15.0", width: "48.2", height: "8.6", depth: "73.0",
    },
    {
      name: "Lenovo ThinkSystem SR650 V3", slug: "lenovo-sr650-v3",
      shortDescription: "2U rack server with exceptional scalability",
      description: "Lenovo ThinkSystem SR650 V3 is a 2-socket 2U rack server designed for maximum performance and reliability.",
      sku: "SR650-V3", price: "19500.00", costPrice: "14800.00",
      brandId: brandMap["lenovo"].id, useId: insertedUses[2].id, condition: "New",
      isActive: true, isFeatured: false, totalStock: 20, availableStock: 19,
      categorySlugs: ["rack-servers"], weight: "15.5", width: "48.2", height: "8.6", depth: "73.5",
    },
    {
      name: "Fortinet FortiGate 100F Firewall", slug: "fortinet-fg-100f",
      shortDescription: "Next-gen firewall for enterprise edge",
      description: "FortiGate 100F delivers AI-powered security with NGFW capabilities, SSL inspection, and SD-WAN in a compact form factor.",
      sku: "FG-100F", price: "5800.00", compareAtPrice: "6500.00", costPrice: "4200.00",
      brandId: brandMap["fortinet"].id, useId: insertedUses[3].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 35, availableStock: 33,
      categorySlugs: ["firewalls"], weight: "2.3", width: "24.0", height: "4.4", depth: "28.0",
    },
    {
      name: "Palo Alto PA-440 Firewall", slug: "palo-alto-pa-440",
      shortDescription: "ML-powered NGFW for mid-size enterprises",
      description: "Palo Alto Networks PA-440 Series delivers ML-powered NGFW security with precision AI to stop threats.",
      sku: "PA-440", price: "7200.00", costPrice: "5300.00",
      brandId: brandMap["palo-alto"].id, useId: insertedUses[3].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 15, availableStock: 14,
      categorySlugs: ["firewalls"], weight: "2.8", width: "24.0", height: "4.4", depth: "30.0",
    },
    {
      name: "Ubiquiti UniFi U6 Pro Access Point", slug: "unifi-u6-pro",
      shortDescription: "WiFi 6 dual-band enterprise AP",
      description: "High-performance WiFi 6 access point for enterprise deployments with seamless roaming.",
      sku: "U6-PRO", price: "650.00", compareAtPrice: "750.00", costPrice: "480.00",
      brandId: brandMap["ubiquiti"].id, useId: insertedUses[4].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 120, availableStock: 115,
      categorySlugs: ["wireless"], weight: "0.5", width: "22.0", height: "4.5", depth: "22.0",
    },
    {
      name: "Ruckus R550 Access Point", slug: "ruckus-r550",
      shortDescription: "WiFi 6 dual-band with BeamFlex+",
      description: "Enterprise WiFi 6 access point with patented BeamFlex+ adaptive antenna technology.",
      sku: "R550-ROW", price: "890.00", costPrice: "650.00",
      brandId: brandMap["ruckus"].id, useId: insertedUses[1].id, condition: "New",
      isActive: true, isFeatured: false, totalStock: 45, availableStock: 43,
      categorySlugs: ["wireless"], weight: "0.4", width: "21.0", height: "4.0", depth: "21.0",
    },
    {
      name: "APC Smart-UPS SMT2200", slug: "apc-smt2200",
      shortDescription: "2200VA Tower UPS with line interactive topology",
      description: "APC Smart-UPS with Pure Sinewave output, 2200VA/1980W, ideal for servers and network equipment.",
      sku: "SMT2200MI", price: "3200.00", compareAtPrice: "3600.00", costPrice: "2400.00",
      brandId: brandMap["apc"].id, useId: insertedUses[0].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 28, availableStock: 25,
      categorySlugs: ["ups"], weight: "32.0", width: "30.5", height: "43.5", depth: "66.5",
    },
    {
      name: "Synology DS1823xs+ NAS", slug: "synology-ds1823xs",
      shortDescription: "8-bay NAS for SMB and enterprise",
      description: "High-performance 8-bay NAS with AMD Ryzen processor, 10GbE connectivity, and Synology DSM.",
      sku: "DS1823XS", price: "4500.00", compareAtPrice: "5000.00", costPrice: "3400.00",
      brandId: brandMap["synology"].id, useId: insertedUses[0].id, condition: "New",
      isActive: true, isFeatured: true, totalStock: 15, availableStock: 13,
      categorySlugs: ["nas"], weight: "8.5", width: "30.0", height: "24.0", depth: "28.0",
    },
    {
      name: "Juniper EX2300-48P Switch", slug: "juniper-ex2300-48p",
      shortDescription: "48-port PoE+ Gigabit Ethernet switch",
      description: "Juniper EX2300 delivers cost-effective, scalable enterprise access switching with 48 PoE+ ports.",
      sku: "EX2300-48P", price: "5500.00", costPrice: "4000.00",
      brandId: brandMap["juniper"].id, useId: insertedUses[1].id, condition: "Used - Excellent",
      isActive: true, isFeatured: false, totalStock: 22, availableStock: 20,
      categorySlugs: ["switches"], weight: "5.5", width: "44.0", height: "4.4", depth: "36.0",
    },
    {
      name: "Microsoft Windows Server 2022 Standard", slug: "microsoft-ws2022-std",
      shortDescription: "16-core server operating system license",
      description: "Windows Server 2022 Standard Edition with advanced security, hybrid capabilities, and application platform.",
      sku: "WS2022-STD", price: "3200.00", costPrice: "2500.00",
      brandId: brandMap["microsoft"].id, useId: insertedUses[2].id, condition: "New",
      isActive: true, isFeatured: false, totalStock: 999, availableStock: 999,
      categorySlugs: ["software-licensing"], isBundle: true,
    },
  ];

  const insertedProducts = [];
  for (const p of productData) {
    const { categorySlugs, ...productValues } = p;
    const prods = await db.insert(products).values(productValues as any).returning();
    const prod = prods[0]!;
    insertedProducts.push(prod);

    // Link categories
    if (categorySlugs?.length) {
      const catIds = categorySlugs.map((slug: string) => {
        const c = subCatMap[slug] || catMap[slug];
        return c?.id;
      }).filter(Boolean);
      for (const catId of catIds) {
        await db.insert(productCategories).values({ productId: prod.id, categoryId: catId!, isPrimary: true });
      }
    }

    // Add images
    await db.insert(productImages).values({
      productId: prod.id,
      url: `/images/products/${prod.slug}.jpg`,
      alt: prod.name,
      isPrimary: true,
      sortOrder: 0,
    });

    // Add specs
    type SpecInput = { productId: string; label: string; value: string; group: string; sortOrder: number };
    const specs: SpecInput[] = [];
    const brandName = p.brandId ? (brandMap[p.brandId as string]?.name ?? "Generic") : "Generic";
    specs.push({ productId: prod.id, label: "Manufacturer", value: brandName, group: "General", sortOrder: 0 });
    specs.push({ productId: prod.id, label: "Condition", value: p.condition ?? "New", group: "General", sortOrder: 1 });
    specs.push({ productId: prod.id, label: "Warranty", value: "1 Year", group: "General", sortOrder: 2 });
    if (p.weight) {
      specs.push({ productId: prod.id, label: "Weight", value: `${p.weight} kg`, group: "Physical", sortOrder: 3 });
    }
    for (const spec of specs) {
      await db.insert(productSpecs).values(spec);
    }
  }

  // ── Warehouses & Stock ──
  const whDubaiRows = await db.insert(warehouses).values({
    name: "Dubai Main Warehouse", code: "DXB-MAIN",
    address: "Dubai Industrial City, Warehouse Block B",
    city: "Dubai", emirate: "Dubai", isActive: true,
  }).returning();
  const whDubai = whDubaiRows[0]!;

  const whAbuDhabiRows = await db.insert(warehouses).values({
    name: "Abu Dhabi Warehouse", code: "AUH-WH",
    address: "Abu Dhabi Ports Logistics Zone",
    city: "Abu Dhabi", emirate: "Abu Dhabi", isActive: true,
  }).returning();
  const whAbuDhabi = whAbuDhabiRows[0]!;

  for (const prod of insertedProducts) {
    const qty = Math.floor(Math.random() * 50) + 5;
    await db.insert(stock).values({
      warehouseId: whDubai.id, productId: prod.id,
      quantity: qty, reserved: 0, available: qty,
      minimumStock: 5,
    });
    if (Math.random() > 0.5) {
      await db.insert(stock).values({
        warehouseId: whAbuDhabi.id, productId: prod.id,
        quantity: Math.floor(qty / 2), reserved: 0, available: Math.floor(qty / 2),
        minimumStock: 3,
      });
    }
  }

  // ── Reviews ──
  const reviewTexts = [
    { rating: 5, title: "Excellent product", content: "Outstanding quality and fast delivery across UAE." },
    { rating: 4, title: "Very good", content: "Product matches description. Would recommend." },
    { rating: 5, title: "Perfect for our data center", content: "Deployed in our Dubai Data Center, works flawlessly." },
    { rating: 4, title: "Good value", content: "Competitive pricing compared to other UAE vendors." },
  ];
  if (insertedProducts.length > 0 && admin) {
    for (const prod of insertedProducts.slice(0, 5)) {
      const r = reviewTexts[Math.floor(Math.random() * reviewTexts.length)]!;
      await db.insert(reviews).values({
        productId: prod!.id,
        userId: admin.id,
        rating: r.rating,
        title: r.title,
        content: r.content,
        isApproved: true,
      });
    }
  }

  // ── Combo Offers ──
  if (insertedProducts.length >= 3) {
    const [combo] = await db.insert(comboOffers).values({
      name: "Small Business Starter Pack", slug: "smb-starter-pack",
      description: "Everything you need to start your business network",
      discountType: "PERCENTAGE", discountValue: "10.00", isActive: true,
    }).returning();

    if (insertedProducts[2] && insertedProducts[3]) {
      await db.insert(comboOfferItems).values([
        { offerId: combo!.id, productId: insertedProducts[2].id, quantity: 1 },
        { offerId: combo!.id, productId: insertedProducts[3].id, quantity: 1 },
      ]);
    }
  }

  // ── Coupons ──
  await db.insert(coupons).values([
    { code: "WELCOME10", description: "10% off for new customers", type: "PERCENTAGE", value: "10.00", minOrderAmount: "500.00", maxDiscount: "500.00", usageLimit: 100, isActive: true },
    { code: "BULK5", description: "5% off bulk orders", type: "PERCENTAGE", value: "5.00", minOrderAmount: "10000.00", maxDiscount: "2000.00", usageLimit: 50, isActive: true },
    { code: "FREESHIP", description: "Free shipping on orders above 2000 AED", type: "PERCENTAGE", value: "0.00", isActive: true },
  ]);

  // ── Blog ──
  const blogTagData = [
    { name: "Networking", slug: "networking" },
    { name: "Data Center", slug: "data-center" },
    { name: "Security", slug: "security" },
    { name: "Cloud", slug: "cloud" },
    { name: "UAE Tech", slug: "uae-tech" },
  ];
  const insertedTags = await db.insert(blogTags).values(blogTagData).returning();

  if (admin) {
    const [blog1] = await db.insert(blogPosts).values({
      title: "Top 10 Networking Trends in UAE for 2026", slug: "networking-trends-uae-2026",
      excerpt: "Explore the latest networking trends shaping UAE's digital transformation journey.",
      content: "The UAE continues to lead the region in digital transformation...",
      authorId: admin.id, isPublished: true, publishedAt: new Date(),
      seoTitle: "Networking Trends UAE 2026 | TradeHub UAE Blog",
      seoDescription: "Discover the top networking trends in UAE for 2026 including SD-WAN, WiFi 7, and SASE.",
    }).returning();

    if (blog1) {
      if (insertedTags[0]) await db.insert(blogPostTags).values({ blogPostId: blog1.id, tagId: insertedTags[0].id });
      if (insertedTags[4]) await db.insert(blogPostTags).values({ blogPostId: blog1.id, tagId: insertedTags[4].id });
    }

    await db.insert(blogPosts).values({
      title: "How to Choose the Right Server for Your Dubai Business", slug: "choose-right-server-dubai",
      excerpt: "A comprehensive guide to selecting the ideal server for your business needs in Dubai.",
      content: "Choosing the right server for your business in Dubai...",
      authorId: admin.id, isPublished: true, publishedAt: new Date(Date.now() - 86400000),
    });
  }

  // ── SEO ──
  await db.insert(seoMetadata).values([
    { entityType: "page", entityId: "home", title: "TradeHub UAE - IT Equipment & Enterprise Solutions", description: "Dubai's leading supplier of networking, server, storage and cybersecurity solutions." },
    { entityType: "page", entityId: "about", title: "About TradeHub UAE | UAE's Trusted IT Partner", description: "Learn about TradeHub UAE, your trusted partner for enterprise IT equipment in the UAE." },
  ]);

  await db.insert(redirects).values([
    { from: "/old-products", to: "/products", statusCode: "301" },
    { from: "/categories-old", to: "/categories", statusCode: "301" },
  ]);

  // ── Bulk Sales ──
  const bulkReqs = await db.insert(bulkRequests).values({
    companyName: "Tech Solutions LLC", contactName: "Ali Hassan",
    email: "ali@techsolutions.ae", phone: "+971501234571",
    message: "Looking for 50 Cisco switches for a school campus deployment.",
    status: "PENDING",
  }).returning();
  const bulkReq = bulkReqs[0];

  if (bulkReq && insertedProducts[0]) {
    await db.insert(bulkRequestItems).values({
      bulkRequestId: bulkReq.id, productId: insertedProducts[0].id,
      quantity: 50, targetPrice: "7500.00",
    });
  }

  console.log("✅ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
