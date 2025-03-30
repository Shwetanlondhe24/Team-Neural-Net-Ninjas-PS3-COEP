import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800", className)} {...props} />
));
Badge.displayName = "Badge";

export { Badge };
