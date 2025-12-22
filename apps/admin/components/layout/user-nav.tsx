"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@repo/ui"; // تأكد أن هذا المسار يشير إلى ملف dropdown-menu.tsx الجديد لديك
import { LogOut, CreditCard, Settings, User as UserIcon } from "lucide-react";

interface UserNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <DropdownMenu>
      {/* 
        التصحيح الحديث:
        DropdownMenuTrigger هو "الزر" الحقيقي (Button).
        نقوم بإزالة الستايلات الافتراضية ونعطيه شكل الدائرة.
      */}
      <DropdownMenuTrigger className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:opacity-80">
        <Avatar className="h-9 w-9 border border-border/50 cursor-pointer">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback className="text-xs font-medium bg-muted">
            {getUserInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8 border border-border/50">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="text-[10px]">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate text-foreground">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground leading-none truncate">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function UserNavSkeleton() {
  return (
    <Skeleton className="h-9 w-9 rounded-full bg-muted" />
  );
}