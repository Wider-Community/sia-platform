import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedInputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ className, error, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <motion.div
        animate={
          error
            ? { x: [0, -4, 4, -4, 4, 0] }
            : isFocused
              ? { scale: 1.01 }
              : { scale: 1 }
        }
        transition={
          error
            ? { duration: 0.4, ease: "easeInOut" }
            : { duration: 0.15, ease: "easeOut" }
        }
      >
        <input
          ref={ref}
          type={type}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "transition-all duration-200 ease-out",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]",
            error &&
              "border-destructive ring-destructive/20 dark:ring-destructive/40",
            className,
          )}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </motion.div>
    );
  },
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput };
