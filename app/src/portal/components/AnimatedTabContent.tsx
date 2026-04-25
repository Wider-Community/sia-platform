import { TabsContent } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

interface AnimatedTabContentProps
  extends React.ComponentProps<typeof TabsContent> {
  /** Currently active tab value — pass the controlled Tabs value here */
  activeValue?: string;
}

/**
 * Drop-in wrapper around shadcn TabsContent that adds a crossfade transition.
 *
 * Usage:
 *   <Tabs value={tab} onValueChange={setTab}>
 *     <TabsList>...</TabsList>
 *     <AnimatedTabContent value="overview" activeValue={tab}>...</AnimatedTabContent>
 *     <AnimatedTabContent value="activity" activeValue={tab}>...</AnimatedTabContent>
 *   </Tabs>
 */
export function AnimatedTabContent({
  activeValue,
  children,
  value,
  className,
  ...props
}: AnimatedTabContentProps) {
  // When activeValue is provided we can drive AnimatePresence;
  // otherwise fall back to the default radix behaviour (no animation).
  const isActive = activeValue !== undefined ? activeValue === value : true;

  return (
    <TabsContent value={value} className={className} forceMount {...props}>
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </TabsContent>
  );
}
