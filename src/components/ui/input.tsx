import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-input bg-white/[0.03] px-4 py-2 text-sm text-cloud transition-colors duration-200",
          "placeholder:text-faint",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-cloud",
          "focus-visible:outline-none focus-visible:border-violet/60 focus-visible:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-violet/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
