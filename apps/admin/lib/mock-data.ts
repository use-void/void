// lib/mock-data.ts

export type CustomerStatus = "active" | "inactive" | "blocked";

export interface Order {
    id: string;
    date: string;
    status: OrderStatus; // Use OrderStatus type
    paymentStatus: PaymentStatus; // Add paymentStatus
    total: number;
}

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
    stats: {
        totalOrders: number;
        totalSpent: number;
        avgOrderValue: number;
    };
    recentOrders: Order[];
}

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
            { id: "ORD-1001", date: "2024-12-01", status: "completed", paymentStatus: "paid", total: 154.00 },
            { id: "ORD-0985", date: "2024-11-15", status: "completed", paymentStatus: "paid", total: 45.50 },
            { id: "ORD-0920", date: "2024-10-30", status: "completed", paymentStatus: "paid", total: 29.99 },
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
            { id: "ORD-1002", date: "2024-12-05", status: "pending", paymentStatus: "unpaid", total: 75.00 },
            { id: "ORD-0990", date: "2024-11-20", status: "completed", paymentStatus: "paid", total: 75.00 },
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
    },
    {
        id: "demo-customer",
        name: "Demo User",
        email: "demo@example.com",
        phone: "+1 (555) 000-0000",
        address: "Demo Street\nDemo City, DC 00000",
        joinDate: "2024-01-01T00:00:00Z",
        status: "active",
        ordersCount: 5,
        totalSpent: 500.00,
        stats: {
            totalOrders: 5,
            totalSpent: 500.00,
            avgOrderValue: 100.00
        },
        recentOrders: [
            { id: "ORD-DEMO-1", date: "2024-12-10", status: "completed", paymentStatus: "paid", total: 100.00 },
            { id: "ORD-DEMO-2", date: "2024-12-11", status: "completed", paymentStatus: "paid", total: 200.00 },
        ]
    }
];

export function getCustomerById(id: string): Customer | undefined {
    return mockCustomersData.find(customer => customer.id === id);
}

export type ProductStatus = "active" | "draft" | "archived";
export type ProductType = "physical" | "digital";

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

export function getProductById(id: string): Product | undefined {
    return mockProductsData.find(product => product.id === id);
}

export type OrderStatus = "completed" | "processing" | "pending" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";

export interface OrderItem {
    name: string;
    variant?: string;
    quantity: number;
    price: number;
}

export interface OrderDetail extends Order {
    shippingAddress?: string;
    items?: OrderItem[];
    subtotal?: number;
    shipping?: number;
    customerName: string; // denormalized for list view
    customerEmail: string; // denormalized for list view
    customerId?: string;
}

// Update Order interface to match usage roughly or extend it
export const mockOrdersData: OrderDetail[] = [
    {
        id: "ORD-001",
        date: new Date().toISOString(),
        status: "completed",
        paymentStatus: "paid",
        total: 120.50,
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerId: "CUST-001",
        shippingAddress: "123 Main St, New York, NY",
        items: [
            { name: "Premium T-Shirt", variant: "L / Black", quantity: 2, price: 25.00 },
            { name: "Denim Jeans", variant: "32 / Blue", quantity: 1, price: 70.00 }
        ]
    },
    {
        id: "ORD-002",
        date: new Date(Date.now() - 86400000).toISOString(),
        status: "processing",
        total: 450.00,
        customerName: "Jane Smith",
        customerEmail: "jane@company.com",
        paymentStatus: "paid"
    },
    {
        id: "ORD-003",
        date: new Date(Date.now() - 172800000).toISOString(),
        status: "pending",
        total: 35.00,
        customerName: "Bob Wilson",
        customerEmail: "bob@test.com",
        paymentStatus: "unpaid"
    },
    {
        id: "demo-order",
        date: "2024-12-12",
        status: "completed",
        total: 130.00,
        paymentStatus: "paid",
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerId: "CUST-001",
        subtotal: 120.00,
        shipping: 10.00,
        shippingAddress: "123 Main St\nApt 4B\nNew York, NY 10001\nUnited States",
        items: [
            { name: "Premium T-Shirt", variant: "L / Black", quantity: 2, price: 25.00 },
            { name: "Denim Jeans", variant: "32 / Blue", quantity: 1, price: 70.00 }
        ]
    }
];

export function getOrderById(id: string): OrderDetail | undefined {
    return mockOrdersData.find(order => order.id === id);
}