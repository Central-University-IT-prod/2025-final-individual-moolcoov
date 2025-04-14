import { AnimatePresence, motion } from "motion/react";
import React, { type JSX } from "react";

interface CreateScreenProps {
  next: () => Promise<void>;
  prev?: () => Promise<void>;
}

export type CreateScreen = ({ next, prev }: CreateScreenProps) => JSX.Element;

export const CreateModal = ({
  screens,
  onFinish,
}: {
  screens: CreateScreen[];
  onFinish?: () => Promise<void> | void;
}) => {
  const [index, setIndex] = React.useState(0);

  const Screen: CreateScreen | undefined = React.useMemo(
    () => screens.at(index),
    [index],
  );

  if (!Screen) {
    onFinish?.();
    return;
  }

  const next = React.useCallback(async () => {
    if (index === screens.length - 1) {
      await onFinish?.();
      return;
    }

    setIndex((prev) => prev + 1);
  }, [index, screens, onFinish]);

  const prev = React.useCallback(async () => {
    setIndex((prev) => prev - 1);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="absolute flex h-full max-h-full w-[100dvw] flex-col lg:w-full"
        initial={
          index != 0
            ? {
                opacity: 0,
                transform: "translateX(100%)",
                position: "absolute",
              }
            : {}
        }
        animate={{
          opacity: 1,
          transform: "none",
          position: "relative",
        }}
        exit={{
          opacity: 0,
          transform: "translateX(-100%)",
          position: "absolute",
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        key={index}
      >
        <Screen next={next} prev={index != 0 ? prev : undefined} />
      </motion.div>
    </AnimatePresence>
  );
};
