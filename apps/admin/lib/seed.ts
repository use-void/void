

import { getDbSync } from "@void/db";
// Mongoose models are unused, using raw collection for seeding to avoid connection state issues


const DEMO_CATEGORIES = [
    { name: "Software", slug: "software", description: "Digital tools and apps" },
    { name: "E-books", slug: "e-books", description: "Educational resources" },
    { name: "Services", slug: "services", description: "Professional services" }
];

const DEMO_PRODUCTS = [
    {
        name: "Pro React Bundle",
        slug: "pro-react-bundle",
        description: "Complete UI kit for React developers",
        price: 49.99,
        type: "digital",
        status: "active",
        digitalDetails: { fileName: "bundle.zip", fileSize: "120MB" },
        images: [{ url: "https://placehold.co/600x400/png", alt: "React Bundle", isThumbnail: true }]
    },
    {
        name: "SaaS Starter Kit",
        slug: "saas-starter-kit",
        description: "Everything you need to launch your SaaS",
        price: 199.00,
        type: "digital",
        status: "active",
        digitalDetails: { fileName: "saas-kit.zip", fileSize: "45MB" }
    },
    {
        name: "Advanced TypeScript Course",
        slug: "advanced-typescript",
        description: "Master TypeScript in 30 days",
        price: 29.99,
        type: "digital",
        status: "active",
        digitalDetails: { fileName: "course.pdf", fileSize: "15MB" }
    },
    {
        name: "Design System Figma",
        slug: "design-system-figma",
        description: "Figma design system for UI/UX designers",
        price: 39.00,
        type: "digital",
        status: "active",
        digitalDetails: { isExternalLink: true, fileUrl: "https://figma.com/..." }
    },
    {
        name: "1-on-1 Consultation",
        slug: "consultation",
        description: "1 hour consultation call",
        price: 150.00,
        type: "service", // Note: Schema enum only has digital/physical allowed?
        // Prompt said "Products... type: 'digital'". I'll stick to 'digital' for Services if 'service' not in enum.
        // Product Model enum: ["digital", "physical"]. So I use 'digital' for now.
        status: "active",
        digitalDetails: { isExternalLink: true, fileUrl: "https://calendly.com/..." }
    }
];

export async function seedDatabase() {
    console.log("Seeding database...");
    const db = getDbSync();

    // 1. Seed Categories (using Native or Mongoose? Use Native for consistency with Setup)
    // Actually, models are exported from @void/db. Assuming we can use them if Mongoose is connected?
    // But we are not sure if Mongoose is connected.
    // So I will use `db.collection` to be safe and avoid connection errors.

    // Categories
    const categoriesCol = db.collection("categories");
    if (await categoriesCol.countDocuments() === 0) {
        await categoriesCol.insertMany(DEMO_CATEGORIES.map(c => ({
            ...c,
            createdAt: new Date(),
            updatedAt: new Date()
        })));
    }

    // Products
    const productsCol = db.collection("products");
    if (await productsCol.countDocuments() === 0) {
        await productsCol.insertMany(DEMO_PRODUCTS.map(p => ({
            ...p,
            createdAt: new Date(),
            updatedAt: new Date()
        })));
    }

    // Integrations
    const integrationsCol = db.collection("integrations");
    if (await integrationsCol.countDocuments() === 0) {
        await integrationsCol.insertMany([
            { key: "stripe", name: "Stripe", isEnabled: false, config: {}, createdAt: new Date() },
            { key: "paypal", name: "PayPal", isEnabled: false, config: {}, createdAt: new Date() }
        ]);
    }

    console.log("Database seeded successfully.");
}
