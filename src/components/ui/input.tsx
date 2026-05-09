import * as React from "react";
import { cn } from "@/lib/utils";

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, NativeInputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-white/15 bg-[#0c0c10] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
