"use client"

import { Bell } from "lucide-react"
import { Button } from "@repo/ui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui"
import Link from "next/link"

export function NotificationsNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className=" h-9 w-9 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2 shrink-0  bg-red-600" />
            <span className="sr-only">Notifications</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between font-bold">
            Notifications
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 ">3 New</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <p className="text-sm font-medium">New order received</p>
            <p className="text-xs text-muted-foreground">You have a new order #ORD-1234</p>
            <span className="text-[10px] text-muted-foreground mt-1">2 mins ago</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <p className="text-sm font-medium">Customer registered</p>
            <p className="text-xs text-muted-foreground">Ahmed Ali just joined your store</p>
            <span className="text-[10px] text-muted-foreground mt-1">1 hour ago</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
            <p className="text-sm font-medium">System Update</p>
            <p className="text-xs text-muted-foreground">Version 2.0.4 is now live</p>
            <span className="text-[10px] text-muted-foreground mt-1">Yesterday</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer text-center flex justify-center py-2 font-medium" 
            render={<Link href="/notifications">View all</Link>}
          />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
