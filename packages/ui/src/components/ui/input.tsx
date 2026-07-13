import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-line bg-white px-4 text-base text-ink placeholder:text-ink-3 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink/40 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
