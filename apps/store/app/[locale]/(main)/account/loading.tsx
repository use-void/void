export default function AccountLoading() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 animate-pulse">
                <div className="w-full md:w-64 space-y-4">
                    <div className="h-48 bg-muted rounded-2xl" />
                    <div className="space-y-2">
                        <div className="h-12 bg-muted rounded-xl" />
                        <div className="h-12 bg-muted rounded-xl" />
                        <div className="h-12 bg-muted rounded-xl" />
                    </div>
                </div>
                <div className="flex-1 h-[600px] bg-muted rounded-2xl border" />
            </div>
        </div>
    );
}
