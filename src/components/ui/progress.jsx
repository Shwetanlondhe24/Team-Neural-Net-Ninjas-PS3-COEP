import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

export const Progress = React.forwardRef(({ value, max = 100, className, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`relative h-4 w-full overflow-hidden rounded bg-gray-200 ${className}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full bg-blue-500 transition-all"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = "Progress";
