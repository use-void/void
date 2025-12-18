// apps\admin\lib\mock-data.ts

// ==========================================
// 1. Enums & Shared Types
// ==========================================

export type OrderStatus = "completed" | "processing" | "pending" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type CustomerStatus = "active" | "inactive" | "blocked";
export type ProductStatus = "active" | "draft" | "archived";
export type ProductType = "physical" | "digital";

// ==========================================
// 2. Interfaces
// ==========================================

// --- Product Interfaces ---
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    compareAt?: number;
    status: ProductStatus;
    stock: number;
    type: ProductType;
    sku?: string;
    barcode?: string;
    vendor?: string;
    image: string | null;
    updatedAt: string;
}

// --- Customer Interfaces ---
export interface CustomerStats {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
}

// Full Customer Profile
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    status: CustomerStatus;
    ordersCount: number;
    totalSpent: number;
    stats: CustomerStats;
    recentOrders: Partial<Order>[];
}

// --- Order Interfaces ---
export interface OrderItem {
    name: string;
    variant?: string;
    quantity: number;
    price: number;
}

// Minimal customer info embedded in an order
export interface OrderCustomerInfo {
    id: string;
    name: string;
    email: string;
}

export interface Order {
    id: string;
    date: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    total: number;
    subtotal: number;
    shipping: number;
    shippingAddress: string;
    // Updated structure to prevent "undefined" access errors
    customer: OrderCustomerInfo; 
    items: OrderItem[];
}

// ==========================================
// 3. Mock Data
// ==========================================

// --- Products Data ---
export const mockProductsData: Product[] = [
    {
        id: "1",
        name: "Premium T-Shirt",
        description: "High quality cotton t-shirt for everyday wear.",
        price: 29.99,
        compareAt: 39.99,
        status: "active",
        stock: 154,
        type: "physical",
        sku: "TSH-001",
        barcode: "123456789",
        vendor: "Void Apparel",
        image: null,
        updatedAt: new Date().toISOString()
    },
    {
        id: "2",
        name: "Digital Artwork 001",
        price: 99.00,
        status: "active",
        stock: 0,
        type: "digital",
        image: null,
        updatedAt: new Date().toISOString()
    },
    {
        id: "3",
        name: "Summer Hat",
        price: 15.50,
        status: "draft",
        stock: 45,
        type: "physical",
        image: null,
        updatedAt: new Date().toISOString()
    },
    {
        id: "demo-product",
        name: "Demo Product",
        description: "This is a demo product for preview.",
        price: 49.99,
        status: "active",
        stock: 100,
        type: "physical",
        image: null,
        updatedAt: new Date().toISOString()
    }
];

// --- Orders Data ---
export const mockOrdersData: Order[] = [
    {
        id: "ORD-001",
        date: new Date().toISOString(),
        status: "completed",
        paymentStatus: "paid",
        total: 120.50,
        subtotal: 95.00,
        shipping: 25.50,
        shippingAddress: "123 Main St, New York, NY, 10001",
        customer: {
            id: "CUST-001",
            name: "John Doe",
            email: "john@example.com"
        },
        items: [
            { name: "Premium T-Shirt", variant: "L / Black", quantity: 2, price: 25.00 },
            { name: "Denim Jeans", variant: "32 / Blue", quantity: 1, price: 70.00 }
        ]
    },
    {
        id: "ORD-002",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "processing",
        paymentStatus: "paid",
        total: 450.00,
        subtotal: 450.00,
        shipping: 0.00,
        shippingAddress: "456 Oak Ave, Seattle, WA, 98101",
        customer: {
            id: "CUST-002",
            name: "Jane Smith",
            email: "jane@company.com"
        },
        items: [
            { name: "Digital Artwork License", variant: "Commercial", quantity: 1, price: 450.00 }
        ]
    },
    {
        id: "ORD-003",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "pending",
        paymentStatus: "unpaid",
        total: 35.00,
        subtotal: 30.00,
        shipping: 5.00,
        shippingAddress: "789 Pine Rd, Miami, FL, 33101",
        customer: {
            id: "CUST-003",
            name: "Bob Wilson",
            email: "bob@test.com"
        },
        items: [
            { name: "Summer Hat", variant: "One Size", quantity: 2, price: 15.00 }
        ]
    },
    {
        id: "demo-order",
        date: "2024-12-12T10:00:00Z",
        status: "completed",
        paymentStatus: "paid",
        total: 130.00,
        subtotal: 120.00,
        shipping: 10.00,
        shippingAddress: "123 Main St\nApt 4B\nNew York, NY 10001\nUnited States",
        customer: {
            id: "CUST-001",
            name: "Demo User",
            email: "demo@example.com"
        },
        items: [
            { name: "Premium T-Shirt", variant: "L / Black", quantity: 2, price: 25.00 },
            { name: "Denim Jeans", variant: "32 / Blue", quantity: 1, price: 70.00 }
        ]
    }
];

// --- Customers Data ---
export const mockCustomersData: Customer[] = [
    {
        id: "CUST-001",
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 (555) 123-4567",
        address: "123 Main St\nSan Francisco, CA 94105",
        joinDate: "2024-01-15T10:00:00Z",
        status: "active",
        ordersCount: 12,
        totalSpent: 1250.00,
        stats: {
            totalOrders: 12,
            totalSpent: 1250.00,
            avgOrderValue: 104.16
        },
        recentOrders: [
            // The (!) operator tells TypeScript: "I trust this index exists"
            mockOrdersData[0]!, 
            mockOrdersData[3]!
        ]
    },
    {
        id: "CUST-002",
        name: "Bob Smith",
        email: "bob@example.com",
        phone: "+1 (555) 987-6543",
        address: "456 Oak Ave\nSeattle, WA 98101",
        joinDate: "2024-03-20T14:30:00Z",
        status: "active",
        ordersCount: 3,
        totalSpent: 150.00,
        stats: {
            totalOrders: 3,
            totalSpent: 150.00,
            avgOrderValue: 50.00
        },
        recentOrders: [
            mockOrdersData[1]!
        ]
    },
    {
        id: "CUST-003",
        name: "Charlie Brown",
        email: "charlie@example.com",
        phone: "",
        address: "No address provided",
        joinDate: "2024-05-10T09:15:00Z",
        status: "inactive",
        ordersCount: 0,
        totalSpent: 0.00,
        stats: {
            totalOrders: 0,
            totalSpent: 0.00,
            avgOrderValue: 0.00
        },
        recentOrders: []
    }
];

// ==========================================
// 4. Helper Functions
// ==========================================

export function getProductById(id: string): Product | undefined {
    return mockProductsData.find(product => product.id === id);
}

export function getOrderById(id: string): Order | undefined {
    return mockOrdersData.find(order => order.id === id);
}

export function getCustomerById(id: string): Customer | undefined {
    return mockCustomersData.find(customer => customer.id === id);
}