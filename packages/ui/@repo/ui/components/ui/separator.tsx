import * as React from "react";
import { Separator as SeparatorPrimitive } from "@repo/ui/components/ui/separator";

import { cn } from "@repo/ui/lib/utils";

function Separator({ className, ...props }: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
