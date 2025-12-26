import { Skeleton } from "@repo/ui";

export default function ProductLoading() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                <Skeleton className="aspect-square w-full rounded-md bg-muted/20" />
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4 bg-muted/20" />
                    <Skeleton className="h-6 w-1/4 bg-muted/20" />
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-4 w-full bg-muted/20" />
                        <Skeleton className="h-4 w-full bg-muted/20" />
                        <Skeleton className="h-4 w-2/3 bg-muted/20" />
                    </div>
                    <div className="flex gap-4 pt-8">
                        <Skeleton className="h-12 flex-1 bg-muted/20 rounded-md" />
                        <Skeleton className="h-12 w-12 bg-muted/20 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}
