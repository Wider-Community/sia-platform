import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedTextareaProps extends React.ComponentProps<"textarea"> {
  error?: boolean;
}

const AnimatedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AnimatedTextareaProps
>(({ className, error, ...props }, ref) => {
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
      <textarea
        ref={ref}
        className={cn(
          "border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
});

AnimatedTextarea.displayName = "AnimatedTextarea";

export { AnimatedTextarea };
