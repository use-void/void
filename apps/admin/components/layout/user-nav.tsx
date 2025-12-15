import { Avatar, AvatarFallback, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Skeleton } from "@repo/ui";
import { LogOut, CreditCard, Settings, UserIcon } from "lucide-react";

interface UserNavProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function UserNav({ user }: UserNavProps) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-secondary transition-all duration-200 cursor-pointer w-full group outline-none">
                    <Avatar className="h-9 w-9 rounded-lg border border-border/50 shadow-none">
                        <AvatarImage src={user.image || ""} alt={user.name} />
                        <AvatarFallback className="rounded-lg bg-muted text-muted-foreground font-medium text-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left">
                        <span className="truncate text-sm font-medium text-foreground group-hover:text-foreground transition-colors">{user.name}</span>
                        <span className="truncate text-xs text-muted-foreground group-hover:text-muted-foreground transition-colors">{user.email}</span>
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover border-border text-muted-foreground" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function UserNavSkeleton() {
    return (
        <div className="flex items-center gap-3 p-2 w-full group-data-[collapsible=icon]:justify-center">
            <Skeleton className="h-9 w-9 rounded-lg bg-muted shrink-0" />
            <div className="space-y-1 group-data-[collapsible=icon]:hidden flex-1 overflow-hidden">
                <Skeleton className="h-3 w-24 bg-muted" />
                <Skeleton className="h-2 w-32 bg-muted/60" />
            </div>
        </div>
    );
}