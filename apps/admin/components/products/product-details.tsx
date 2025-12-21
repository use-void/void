import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { getTranslations } from "@repo/i18n";

async function getProductDetails(id: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
        id,
        name: "Product A",
        description: "This is a detailed description of Product A.",
        price: "$20.00",
        sku: "PROD-A-001",
        stock: 100,
        category: "Electronics",
        status: "In Stock"
    };
}

export async function ProductDetails({ productId }: { productId: string }) {
    const product = await getProductDetails(productId);
    const t = await getTranslations("Admin.products.details");

    return (
         <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                     <Card className="bg-card border-border rounded-xl">
                        <CardHeader>
                            <CardTitle>{t("basicInfo")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg">{product.name}</h3>
                                <p className="text-muted-foreground mt-2">{product.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-6">
                     <Card className="bg-card border-border rounded-xl">
                        <CardHeader>
                            <CardTitle>{t("status")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{t("stock")}:</span>
                                <span className="font-medium">{product.stock}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{t("currentStatus")}:</span>
                                 <span className={`px-2 py-1 text-xs rounded-full 
                                    ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                                      product.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 
                                      'bg-yellow-100 text-yellow-700'}`}>
                                    {product.status}
                                </span>
                             </div>
                              <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-muted-foreground">{t("price")}:</span>
                                <span className="font-bold text-lg">{product.price}</span>
                             </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card border-border rounded-xl">
                        <CardHeader>
                            <CardTitle>{t("organization")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <p className="text-sm font-medium text-muted-foreground">{t("category")}</p>
                                <p>{product.category}</p>
                             </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">{t("sku")}</p>
                                <p>{product.sku}</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export function ProductDetailsSkeleton() {
    return (
         <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                     <Card className="bg-card border-border rounded-xl">
                        <CardHeader>
                             <Skeleton className="h-6 w-[150px] bg-muted" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Skeleton className="h-8 w-[250px] bg-muted" />
                             <Skeleton className="h-20 w-full bg-muted/50" />
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-6">
                     <Card className="bg-card border-border rounded-xl">
                        <CardHeader>
                             <Skeleton className="h-6 w-[100px] bg-muted" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-center">
                                 <Skeleton className="h-4 w-[60px] bg-muted" />
                                 <Skeleton className="h-4 w-[40px] bg-muted" />
                             </div>
                             <div className="flex justify-between items-center">
                                 <Skeleton className="h-4 w-[80px] bg-muted" />
                                 <Skeleton className="h-5 w-[80px] bg-muted" />
                             </div>
                              <div className="flex justify-between items-center pt-4 border-t">
                                 <Skeleton className="h-4 w-[50px] bg-muted" />
                                 <Skeleton className="h-6 w-[60px] bg-muted" />
                             </div>
                        </CardContent>
                    </Card>
                     <Card className="bg-card border-border rounded-xl">
                        <CardHeader>
                             <Skeleton className="h-6 w-[120px] bg-muted" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                 <Skeleton className="h-3 w-[60px] bg-muted/50" />
                                 <Skeleton className="h-4 w-[100px] bg-muted" />
                             </div>
                              <div className="space-y-2">
                                 <Skeleton className="h-3 w-[40px] bg-muted/50" />
                                 <Skeleton className="h-4 w-[120px] bg-muted" />
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
