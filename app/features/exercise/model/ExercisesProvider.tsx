import React from "react";
import type {
  Exercise,
  ExerciseFilters,
} from "~/features/exercise/model/types";
import { getEquipmentLabel } from "~/shared/lib/equipment";

interface ExercisesContextType {
  exercises: Exercise[];

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  filters: ExerciseFilters;
  setFilters: React.Dispatch<React.SetStateAction<ExerciseFilters>>;
  activeFilters: number;
}

const ExercisesContext = React.createContext<ExercisesContextType | undefined>(
  undefined,
);

interface ExercisesProviderProps {
  exercises: Exercise[];
  children?: React.ReactNode;
}

export const ExercisesProvider = ({
  exercises,
  children,
}: ExercisesProviderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<ExerciseFilters>({});

  const activeFilters = React.useMemo(() => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  }, [filters]);

  const filteredExercises = React.useMemo(() => {
    if (searchQuery != "") {
      const searchQueryLower = searchQuery.toLowerCase();

      return exercises.filter((exercise) => {
        const matchesName = exercise.title
          .toLowerCase()
          .includes(searchQueryLower);

        const matchesEquipment = exercise.equipment?.some((eq) => {
          return getEquipmentLabel(eq)
            ?.toLowerCase()
            .includes(searchQueryLower);
        });

        return matchesName || matchesEquipment;
      });
    }

    return exercises.filter((exercise) => {
      const matchesDifficulty =
        !(filters.difficulty && filters.difficulty.length > 0) ||
        filters.difficulty.includes(exercise.difficulty);

      const matchesEquipment =
        !(filters.equipment && filters.equipment.length > 0) ||
        exercise.equipment?.some((eq) => filters.equipment!.includes(eq));

      const matchesTags =
        !(filters.tags && filters.tags.length > 0) ||
        (exercise.tags &&
          exercise.tags.some((tag) => filters.tags!.includes(tag.id)));

      return matchesDifficulty && matchesEquipment && matchesTags;
    });
  }, [exercises, filters, searchQuery]);

  return (
    <ExercisesContext.Provider
      value={{
        exercises: filteredExercises,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        activeFilters,
      }}
    >
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => {
  const context = React.useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error("useExercises must be used within a ExercisesProvider");
  }
  return context.exercises;
};

export const useExercisesSearchQuery = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const context = React.useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error("useSearchQuery must be used within a ExercisesProvider");
  }
  return [context.searchQuery, context.setSearchQuery];
};

export const useExercisesFilters = (): [
  ExerciseFilters,
  React.Dispatch<React.SetStateAction<ExerciseFilters>>,
  number,
] => {
  const context = React.useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a ExercisesProvider");
  }
  return [context.filters, context.setFilters, context.activeFilters];
};
