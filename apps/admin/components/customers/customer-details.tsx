import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { getTranslations } from "@repo/i18n";

async function getCustomerDetails(id: string) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
        id,
        name: "Alice Johnson",
        email: "alice@example.com",
        phone: "+1 234 567 890",
        address: "123 Main St, Anytown, USA",
        joinDate: "2023-01-15",
        status: "Active"
    };
}

export async function CustomerDetails({ customerId }: { customerId: string }) {
    const customer = await getCustomerDetails(customerId);
    const t = await getTranslations("Admin.customers.details");

    return (
        <div className="space-y-6">
            <Card className="bg-card border-border rounded-xl">
                <CardHeader>
                    <CardTitle>{customer.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("email")}</p>
                            <p>{customer.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("phone")}</p>
                            <p>{customer.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("status")}</p>
                             <span className={`px-2 py-1 text-xs rounded-full ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                {customer.status}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{t("joinDate")}</p>
                            <p>{customer.joinDate}</p>
                        </div>
                    </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("address")}</p>
                        <p>{customer.address}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function CustomerDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Card className="bg-card border-border rounded-xl">
                 <CardHeader>
                    <Skeleton className="h-8 w-[250px] bg-muted" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-[100px] bg-muted/50" />
                                <Skeleton className="h-4 w-[150px] bg-muted" />
                            </div>
                        ))}
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-3 w-[100px] bg-muted/50" />
                        <Skeleton className="h-4 w-[300px] bg-muted" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
