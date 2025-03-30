import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
    <ScrollAreaPrimitive.Viewport className="w-full h-full rounded-md">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar
      orientation="vertical"
      className="w-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-all"
    >
      <ScrollAreaPrimitive.Thumb className="w-full bg-gray-500 rounded-md" />
    </ScrollAreaPrimitive.Scrollbar>
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
