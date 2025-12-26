import fs from 'fs';
import path from 'path';

// Manual .env loading to avoid dependencies
function loadEnv(filePath: string) {
    try {
        if (fs.existsSync(filePath)) {
            console.log(`📄 Loading env from: ${filePath}`);
            const content = fs.readFileSync(filePath, 'utf-8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.warn(`⚠️ Failed to load env from ${filePath}`, e);
    }
}

// Try loading from different locations
loadEnv(path.resolve(__dirname, '../../../.env'));
loadEnv(path.resolve(__dirname, '../../../apps/store/.env.local'));

import { connectToDatabase } from './connection';
import { Product } from './models/product.model';
import { Category } from './models/category.model';
import { Order } from './models/order.model';
import { StoreConfig } from './models/store-config.model';
import { fakerAR as faker } from '@faker-js/faker';
import mongoose from 'mongoose';

async function seed() {
    console.log('🌱 Starting Database Seeding with Realistic Data...');
    await connectToDatabase();

    // 1. Clear relevant collections
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await StoreConfig.deleteMany({});
    console.log('🧹 Cleared existing data (Products, Categories, Orders)');

    // 2. Seed Settings
    await StoreConfig.create({
        isSetupCompleted: true,
        name: { ar: 'متجر فويد', en: 'Void Store' },
        description: { ar: 'وجهتك الأولى للمنتجات الرقمية والإبداعية', en: 'Your premier destination for digital and creative products' },
        slogan: { ar: 'إبداع بلا حدود', en: 'Creativity without limits' },
        financials: {
            defaultCurrency: 'SAR',
            currencies: [
                { code: 'SAR', symbol: { ar: 'ر.س', en: 'SAR' }, exchangeRate: 1, isActive: true },
                { code: 'USD', symbol: { ar: '$', en: '$' }, exchangeRate: 3.75, isActive: true }
            ],
            tax: { isTaxEnabled: true, isTaxInclusive: true, taxId: '300000000000003' },
            payment: {
                moyasar: { isEnabled: true }, // Should be config via env usually
                polar: { isEnabled: true }
            }
        },
        localization: {
            defaultLanguage: 'ar',
            languages: [
                { code: 'ar', name: 'Arabic', isRTL: true, isActive: true, flag: '🇸🇦' },
                { code: 'en', name: 'English', isRTL: false, isActive: true, flag: '🇺🇸' }
            ]
        },
        shopSettings: {
            isMaintenanceMode: false,
            isGuestCheckoutEnabled: true,
            isInventoryTrackingEnabled: true
        }
    });

    // 3. Seed Categories
    const categories = await Category.insertMany([
        { 
            name: { ar: 'ملابس', en: 'Fashion' }, 
            slug: 'fashion', 
            description: { ar: 'أحدث صيحات الموضة', en: 'Latest trends' }, 
            isActive: true 
        },
        { 
            name: { ar: 'منتجات رقمية', en: 'Digital Assets' }, 
            slug: 'digital', 
            description: { ar: 'ملفات، قوالب، وكودات', en: 'Files, templates, and codes' }, 
            isActive: true 
        },
        { 
            name: { ar: 'اشتراكات', en: 'Subscriptions' }, 
            slug: 'subscriptions', 
            description: { ar: 'عضويات وخدمات مميزة', en: 'Memberships and premium services' }, 
            isActive: true 
        },
    ]);
    console.log(`📁 Created ${categories.length} categories`);

    // 4. Seed Products
    const productsDataPayload = [];

    // --- Physical Products (Fashion) ---
    // Images source: Unsplash source API for stable-ish random images based on keywords
    
    productsDataPayload.push({
        name: { ar: 'تيشرت قطني فاخر - أسود', en: 'Premium Cotton T-Shirt - Black' },
        slug: 'premium-cotton-black-tee',
        description: { 
            ar: 'تيشرت مصنوع من القطن المصري 100%، مريح ومناسب للاستخدام اليومي.', 
            en: '100% Egyptian cotton t-shirt, comfortable and perfect for daily wear.' 
        },
        price: 120, // Reasonable price
        images: [
            { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800', alt: 'Black T-Shirt', isThumbnail: true },
            { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=800', alt: 'Black T-Shirt Detail', isThumbnail: false }
        ],
        category: categories[0]._id, // Fashion
        stock: 50,
        type: 'physical',
        status: 'active',
        sku: 'TEE-BLK-001',
        physicalDetails: { sku: 'TEE-BLK-001', stock: 50, weight: 0.2 }
    });

    productsDataPayload.push({
        name: { ar: 'حقيبة ظهر كلاسيكية', en: 'Classic Backpack' },
        slug: 'classic-backpack',
        description: { 
            ar: 'حقيبة ظهر متينة وأنيقة، مثالية للعمل والسفر.', 
            en: 'Durable and stylish backpack, perfect for work and travel.' 
        },
        price: 350, 
        images: [
            { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', alt: 'Backpack', isThumbnail: true }
        ],
        category: categories[0]._id, 
        stock: 20,
        type: 'physical',
        status: 'active',
        sku: 'BAG-CLS-002',
        physicalDetails: { sku: 'BAG-CLS-002', stock: 20, weight: 1.5 }
    });

    // --- Digital Products (Assets) ---
    
    productsDataPayload.push({
        name: { ar: 'حزمة أيقونات Pro 3D', en: 'Pro 3D Icons Pack' },
        slug: 'pro-3d-icons-pack',
        description: { 
            ar: 'مجموعة تضم أكثر من 100 أيقونة ثلاثية الأبعاد عالية الدقة لتصاميمك.', 
            en: 'A collection of 100+ high-resolution 3D icons for your designs.' 
        },
        price: 49, // Approx $13
        images: [
            { url: 'https://images.unsplash.com/photo-1633419461186-7d721f1da021?auto=format&fit=crop&q=80&w=800', alt: '3D Icons', isThumbnail: true }
        ],
        category: categories[1]._id, // Digital
        stock: 9999,
        type: 'digital',
        status: 'active',
        sku: 'DIG-ICN-001',
        digitalDetails: {
            fileUrl: 'https://cdn.void-store.com/assets/icons-pack-v1.zip', // Mock
            fileName: 'icons-pack-v1.zip',
            fileSize: '150MB',
            isExternalLink: false
        },
        integrations: {
            polar: {
                // Using a placeholder ID - User should verify integration
                productId: '9ef6705c-d381-447a-9774-32056e438e8e', 
                priceId: 'price_12345'
            }
        }
    });

    // --- Subscription Products ---

    productsDataPayload.push({
        name: { ar: 'عضوية المصمم المحترف (شهري)', en: 'Pro Designer Membership (Monthly)' },
        slug: 'pro-designer-monthly',
        description: { 
            ar: 'وصول غير محدود لجميع موارد التصميم والقوالب، وتحديثات أسبوعية.', 
            en: 'Unlimited access to all design resources, templates, and weekly updates.' 
        },
        price: 99, 
        images: [
            { url: 'https://images.unsplash.com/photo-1626785774573-4b7993143d2d?auto=format&fit=crop&q=80&w=800', alt: 'Membership Card', isThumbnail: true }
        ],
        category: categories[2]._id, // Subscriptions
        type: 'subscription',
        status: 'active',
        subscriptionDetails: {
            interval: 'month',
            intervalCount: 1,
            trialPeriodDays: 7
        },
        integrations: {
            polar: {
                productId: '11111111-2222-3333-4444-555555555555', // Mock
                priceId: 'price_sub_monthly'
            }
        }
    });

    const createdProducts = await Product.insertMany(productsDataPayload);
    console.log(`📦 Created ${createdProducts.length} curated products`);

    // 5. Seed Orders (Mock history)
    const ordersData = [];
    
    // Create one mock order
    ordersData.push({
        orderNumber: `ORD-${faker.string.numeric(6)}`,
        guestInfo: { email: 'customer@example.com', name: 'Ahmed Ali' },
        items: [
            { 
                productId: createdProducts[0]._id, 
                quantity: 1, 
                snapshot: { name: 'Premium Cotton T-Shirt - Black', price: 120, image: createdProducts[0].images[0].url } 
            }
        ],
        financials: {
            total: 120,
            currency: 'SAR',
            paymentMethod: 'card'
        },
        status: 'completed',
        paymentStatus: 'paid',
        totalDue: 0
    });

    await Order.insertMany(ordersData);
    console.log(`🛒 Created ${ordersData.length} mock orders`);

    console.log('✅ Seeding Completed!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
