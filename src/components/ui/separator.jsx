import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef(({ className, ...props }, ref) => (
  <SeparatorPrimitive.Root ref={ref} className={cn("bg-gray-600 h-[1px] w-full", className)} {...props} />
));

Separator.displayName = SeparatorPrimitive.Root.displayName;
export { Separator };
