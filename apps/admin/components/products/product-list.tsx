import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { Link } from "@repo/i18n/navigation";
import { getTranslations } from "@repo/i18n";
import { Package } from "lucide-react";

async function getProducts() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [
        { id: "1", name: "Product A", price: "$20.00", stock: 100, status: "In Stock" },
        { id: "2", name: "Product B", price: "$80.00", stock: 0, status: "Out of Stock" },
        { id: "3", name: "Product C", price: "$45.00", stock: 25, status: "Low Stock" },
    ];
}

export async function ProductList() {
    const products = await getProducts();
    const t = await getTranslations("Admin.products");

    return (
        <Card className="bg-card border-border rounded-xl">
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="block group">
                            <div className="flex items-center justify-between p-4 border rounded-lg bg-background group-hover:border-primary/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-secondary rounded-full">
                                        <Package className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">{product.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-muted-foreground">{product.stock} in stock</span>
                                    <span className={`px-2 py-1 text-xs rounded-full 
                                        ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                                          product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 
                                          'bg-yellow-100 text-yellow-700'}`}>
                                        {product.status}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export function ProductListSkeleton() {
    return (
        <Card className="bg-card border-border rounded-xl">
            <CardHeader>
                <Skeleton className="h-6 w-[150px] bg-muted" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                             <div className="flex items-center space-x-4">
                                <Skeleton className="h-9 w-9 rounded-full bg-muted" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[150px] bg-muted" />
                                    <Skeleton className="h-3 w-[80px] bg-muted/50" />
                                </div>
                            </div>
                             <div className="flex items-center space-x-4">
                                <Skeleton className="h-4 w-[80px] bg-muted" />
                                <Skeleton className="h-6 w-[70px] bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
