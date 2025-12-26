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
    console.log('🌱 Starting Database Seeding...');
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
        description: { ar: 'أفضل متجر للمنتجات الرقمية والفيزيائية', en: 'The best store for digital and physical products' },
        slogan: { ar: 'أسلوب حياة جديد', en: 'A new lifestyle' },
        financials: {
            defaultCurrency: 'SAR',
            currencies: [{ code: 'SAR', symbol: { ar: 'ر.س', en: 'SAR' }, exchangeRate: 1, isActive: true }],
            tax: { isTaxEnabled: true, isTaxInclusive: true, taxId: '123456789' }
        },
        localization: {
            defaultLanguage: 'ar',
            languages: [
                { code: 'ar', name: 'Arabic', isRTL: true, isActive: true },
                { code: 'en', name: 'English', isRTL: false, isActive: true }
            ]
        },
        shopSettings: {
            isMaintenanceMode: false,
            isGuestCheckoutEnabled: true
        }
    });

    // 3. Seed Categories
    const categories = await Category.insertMany([
        { name: { ar: 'الكترونيات', en: 'Electronics' }, slug: 'electronics', description: { ar: 'أجهزة الكترونية', en: 'Electronic Devices' }, isActive: true },
        { name: { ar: 'منتجات رقمية', en: 'Digital Products' }, slug: 'digital', description: { ar: 'بطاقات وكودات', en: 'Cards and Codes' }, isActive: true },
        { name: { ar: 'ملابس', en: 'Fashion' }, slug: 'fashion', description: { ar: 'أزياء وموضة', en: 'Fashion and Style' }, isActive: true },
    ]);
    console.log(`📁 Created ${categories.length} categories`);

    // 4. Seed Products
    const productsDataPayload = [];

    // Physical Products
    for (let i = 0; i < 10; i++) {
        const nameEn = faker.commerce.productName();
        const slug = faker.helpers.slugify(nameEn).toLowerCase() + '-' + faker.string.alphanumeric(4);
        
        productsDataPayload.push({
            name: { ar: faker.commerce.productName(), en: nameEn },
            slug: slug,
            description: { ar: faker.commerce.productDescription(), en: faker.commerce.productDescription() },
            price: parseFloat(faker.commerce.price({ min: 100, max: 2000 })),
            images: [
                { url: faker.image.urlLoremFlickr({ category: 'technics' }), alt: nameEn, isThumbnail: true },
                { url: faker.image.urlLoremFlickr({ category: 'technics' }), alt: nameEn, isThumbnail: false }
            ],
            category: categories[0]._id, // Electronics
            stock: faker.number.int({ min: 10, max: 50 }),
            type: 'physical',
            status: 'active',
            sku: faker.string.alphanumeric(8).toUpperCase(),
        });
    }

    // Digital Products
    for (let i = 0; i < 5; i++) {
        const nameEn = `${faker.commerce.productName()} License`;
        const slug = faker.helpers.slugify(nameEn).toLowerCase() + '-' + faker.string.alphanumeric(4);

        productsDataPayload.push({
            name: { ar: `رخصة ${faker.commerce.productName()}`, en: nameEn },
            slug: slug,
            description: { ar: 'مفتاح تفعيل أصلي مدى الحياة', en: 'Lifetime genuine license key' },
            price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
            images: [
                { url: faker.image.urlLoremFlickr({ category: 'abstract' }), alt: nameEn, isThumbnail: true }
            ],
            category: categories[1]._id, // Digital
            stock: 999, // Unlimited
            type: 'digital',
            status: 'active',
            sku: faker.string.alphanumeric(8).toUpperCase(),
            digitalDetails: {
                fileUrl: 'https://void-store.com/downloads/license-key.txt',
                fileName: 'license.txt',
                fileSize: '1KB'
            }
        });
    }

    const createdProducts = await Product.insertMany(productsDataPayload);
    console.log(`📦 Created ${createdProducts.length} products`);

    // 5. Seed Orders (Mock history)
    const ordersData = [];
    for (let i = 0; i < 5; i++) {
        const isPaid = faker.datatype.boolean();
        const p = createdProducts[0];
        
        ordersData.push({
            orderNumber: `ORD-${faker.string.numeric(6)}`,
            guestInfo: { email: faker.internet.email(), name: faker.person.fullName() },
            items: [
                { 
                    productId: p._id, 
                    quantity: 1, 
                    snapshot: { name: (p.name as any).en || (p.name as any).ar || 'Product', price: p.price, image: p.images[0]?.url } 
                }
            ],
            financials: {
                total: p.price,
                currency: 'SAR',
                paymentMethod: isPaid ? 'card' : undefined
            },
            status: isPaid ? 'completed' : 'pending',
            paymentStatus: isPaid ? 'paid' : 'unpaid',
            totalDue: isPaid ? 0 : p.price
        });
    }
    await Order.insertMany(ordersData);
    console.log(`🛒 Created ${ordersData.length} mock orders`);

    console.log('✅ Seeding Completed!');
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeding Failed:', err);
    process.exit(1);
});
