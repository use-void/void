import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@repo/ui";
import { Link } from "@repo/i18n/navigation";
import { getTranslations } from "@repo/i18n";

async function getCustomers() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return [
        { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "Active" },
        { id: "2", name: "Bob Smith", email: "bob@example.com", status: "Inactive" },
        { id: "3", name: "Charlie Brown", email: "charlie@example.com", status: "Active" },
    ];
}

export async function CustomerList() {
    const customers = await getCustomers();
    const t = await getTranslations("Admin.customers");

    return (
        <Card className="bg-card border-border ">
            <CardHeader>
                <CardTitle>{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {customers.map((customer) => (
                         <Link href={`/customers/${customer.id}`} key={customer.id} className="block group">
                            <div className="flex items-center justify-between p-4 border  bg-background group-hover:border-primary/50 transition-colors">
                                <div>
                                    <p className="font-medium">{customer.name}</p>
                                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs  ${customer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {customer.status}
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

export function CustomerListSkeleton() {
    return (
        <Card className="bg-card border-border ">
            <CardHeader>
                <Skeleton className="h-6 w-[150px] bg-muted" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border  bg-background">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[200px] bg-muted" />
                                <Skeleton className="h-3 w-[150px] bg-muted/50" />
                            </div>
                            <Skeleton className="h-6 w-[60px] bg-muted" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
