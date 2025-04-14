import { motion } from "motion/react";
import { Spinner } from "./Spinner";
import { cn } from "../lib/utils";

export const Loading = ({ className }: { className?: string }) => {
  return (
    <motion.div
      className={cn(
        "bg-background-100 absolute inset-0 z-10 flex items-center justify-center",
        className,
      )}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Spinner size={26} />
    </motion.div>
  );
};
