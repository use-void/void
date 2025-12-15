export default function LoadingCustomer() {
    return (
        <div className="flex flex-col h-full w-full">
            <div className="px-6 pt-6 animate-pulse">
                {/* Header Actions Skeleton */}
                <div className="flex items-center justify-between mb-8">
                    <div className="h-9 w-32 bg-zinc-800/50 rounded-md" />
                    <div className="flex gap-2">
                        <div className="h-9 w-28 bg-zinc-800/50 rounded-md" />
                        <div className="h-9 w-28 bg-zinc-800/50 rounded-md" />
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-[1fr,2fr]">
                    {/* Sidebar Profile Card Skeleton */}
                    <div className="space-y-6">
                        <div className="p-8 border border-zinc-800/50 rounded-xl bg-card flex flex-col items-center">
                            <div className="h-24 w-24 rounded-full bg-zinc-800/50 mb-6" />
                            <div className="h-6 w-32 bg-zinc-800/50 rounded mb-2" />
                            <div className="h-4 w-48 bg-zinc-800/50 rounded mb-6" />
                            <div className="h-10 w-full bg-zinc-800/50 rounded" />
                        </div>

                        <div className="p-6 border border-zinc-800/50 rounded-xl bg-card h-40" />
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-24 border border-zinc-800/50 rounded-xl bg-card" />
                            <div className="h-24 border border-zinc-800/50 rounded-xl bg-card" />
                            <div className="h-24 border border-zinc-800/50 rounded-xl bg-card" />
                        </div>

                        {/* Recent Orders List */}
                        <div className="border border-zinc-800/50 rounded-xl bg-card h-96" />
                    </div>
                </div>
            </div>
        </div>
    );
}