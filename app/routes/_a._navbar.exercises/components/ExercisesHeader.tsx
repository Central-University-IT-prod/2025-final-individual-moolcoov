import { motion } from "motion/react";
import React from "react";
import { useExercisesSearchQuery } from "~/features/exercise/model/ExercisesProvider";
import { HeaderSearch } from "~/shared/ui/HeaderSearch";

export const ExercisesHeader = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = useExercisesSearchQuery();

  return (
    <header className="bg-background-200 sticky top-0 z-20 flex h-18 w-full items-center border-b px-5 lg:hidden">
      <motion.h1
        className="font-medium-sans text-xl"
        animate={
          expanded
            ? { opacity: 0, transform: "translateX(-10px)" }
            : { opacity: 1, transform: "translateX(0px)" }
        }
      >
        УПРАЖНЕНИЯ
      </motion.h1>

      <HeaderSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </header>
  );
};
