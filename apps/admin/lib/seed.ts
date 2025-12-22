// apps/admin/lib/seed.ts

import { connectDB, Category, Product, Integration } from "@void/db";

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
        type: "digital",
        status: "active",
        digitalDetails: { isExternalLink: true, fileUrl: "https://calendly.com/..." }
    }
];

export async function seedDatabase() {
    console.log("🌱 Seeding database...");
    
    await connectDB();
    const now = new Date(); // نوحد التوقيت لجميع الإدخالات

    // 1. Seed Categories
    const categoriesCount = await Category.estimatedDocumentCount();
    if (categoriesCount === 0) {
        console.log("Inserting Categories...");
        // الحل: نضيف createdAt و updatedAt يدوياً لإرضاء TypeScript
        await Category.insertMany(DEMO_CATEGORIES.map(c => ({
            ...c,
            createdAt: now,
            updatedAt: now
        })));
    }

    // 2. Seed Products
    const productsCount = await Product.estimatedDocumentCount();
    if (productsCount === 0) {
        console.log("Inserting Products...");
        await Product.insertMany(DEMO_PRODUCTS.map(p => ({
            ...p,
            createdAt: now,
            updatedAt: now
        })));
    }

    // 3. Seed Integrations
    const integrationsCount = await Integration.estimatedDocumentCount();
    if (integrationsCount === 0) {
        console.log("Inserting Integrations...");
        // الحل: نضيف createdAt و updatedAt للكائنات المضمنة أيضاً
        await Integration.insertMany([
            { 
                providerId: "stripe", 
                type: "payment", 
                isEnabled: false, 
                config: {},
                credentials: {},
                createdAt: now,
                updatedAt: now
            },
            { 
                providerId: "paypal", 
                type: "payment", 
                isEnabled: false, 
                config: {},
                credentials: {},
                createdAt: now,
                updatedAt: now
            },
            {
                providerId: "resend",
                type: "email",
                isEnabled: false,
                config: {},
                credentials: {},
                createdAt: now,
                updatedAt: now
            }
        ]);
    }

    console.log("✅ Database seeded successfully.");
}