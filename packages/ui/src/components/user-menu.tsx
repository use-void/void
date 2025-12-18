"use client";

import { Link } from "@repo/i18n/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../index"; // أو مسار الاستيراد الصحيح لمكوناتك
import { LogOut, User, Settings } from "lucide-react";

// تعريف واجهة بسيطة للمستخدم
interface UserData {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserMenuProps {
  user?: UserData | null;
  isLoading?: boolean;
  onLogout?: () => void; // دالة للخروج نمررها من الأعلى
}

export function UserMenu({ user, isLoading, onLogout }: UserMenuProps) {
  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden hover:border-zinc-500 transition-colors">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-zinc-400">
                  {user.name?.slice(0, 2).toUpperCase() || "U"}
                </span>
              )}
            </button>
          }
        ></DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-[#141414] border-zinc-800 text-zinc-400"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-white">
                {user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer">
            <User className="mr-2 h-4 w-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-zinc-900 cursor-pointer">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-zinc-800" />
          <DropdownMenuItem
            className="text-rose-600 focus:text-rose-500 focus:bg-rose-950/20 cursor-pointer"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Link
      href="/login"
      className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
    >
      Sign In
    </Link>
  );
}
