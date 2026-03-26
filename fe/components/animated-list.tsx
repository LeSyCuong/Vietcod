import { AnimatePresence, motion, useWillChange } from "framer-motion";
import React, { type ReactElement } from "react";

export const AnimatedList = React.memo(
  ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => {
    const childrenArray = React.Children.toArray(children);

    const containerVariants = {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 1,
        },
      },
    };

    return (
      <motion.div
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, amount: 0.1 }}
        className={`flex flex-col items-center gap-4 ${className}`}
      >
        <AnimatePresence>
          {childrenArray.map((item) => (
            <AnimatedListItem key={(item as ReactElement<any>).key}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  },
);

AnimatedList.displayName = "AnimatedList";

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  const willChange = useWillChange();

  const itemVariants = {
    initial: { y: -400, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={itemVariants}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      layout
      className="mx-auto"
      style={{ willChange }}
    >
      {children as any}
    </motion.div>
  );
}
