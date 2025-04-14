import React from "react";
import type { Workout, WorkoutFilters } from "./types";
import { getEquipmentLabel } from "~/shared/lib/equipment";

interface WorkoutsContextType {
  workouts: Workout[];
  savedWorkouts: Workout[];

  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  filters: WorkoutFilters;
  setFilters: React.Dispatch<React.SetStateAction<WorkoutFilters>>;

  activeFilters: number;
}

const WorkoutsContext = React.createContext<WorkoutsContextType | undefined>(
  undefined,
);

interface WorkoutsProviderProps {
  workouts: Workout[];
  children?: React.ReactNode;
}

export const WorkoutsProvider = ({
  workouts,
  children,
}: WorkoutsProviderProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filters, setFilters] = React.useState<WorkoutFilters>({});

  const savedWorkouts = React.useMemo(() => {
    return workouts.filter((workout) => workout.saved);
  }, [workouts]);

  const activeFilters = React.useMemo(() => {
    return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
  }, [filters]);

  const filteredWorkouts = React.useMemo(() => {
    if (searchQuery != "") {
      const searchQueryLower = searchQuery.toLowerCase();

      return workouts.filter((workout) => {
        const matchesName = workout.title
          .toLowerCase()
          .includes(searchQueryLower);

        const matchesEquipment = workout.equipment?.some((eq) => {
          return getEquipmentLabel(eq)
            ?.toLowerCase()
            .includes(searchQueryLower);
        });

        return matchesName || matchesEquipment;
      });
    }

    return workouts.filter((workout) => {
      const matchesDifficulty =
        !(filters.difficulty && filters.difficulty.length > 0) ||
        filters.difficulty.includes(workout.difficulty);

      const matchesEquipment =
        !(filters.equipment && filters.equipment.length > 0) ||
        workout.equipment?.some((eq) => filters.equipment!.includes(eq));

      const matchesTags =
        !(filters.tags && filters.tags.length > 0) ||
        (workout.tags &&
          workout.tags.some((tag) => filters.tags!.includes(tag.id)));

      return matchesDifficulty && matchesEquipment && matchesTags;
    });
  }, [workouts, filters, searchQuery]);

  return (
    <WorkoutsContext.Provider
      value={{
        workouts: filteredWorkouts,
        savedWorkouts,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        activeFilters,
      }}
    >
      {children}
    </WorkoutsContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = React.useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutsProvider");
  }
  return context.workouts;
};

export const useSavedWorkouts = () => {
  const context = React.useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error("useSavedWorkouts must be used within a WorkoutsProvider");
  }
  return context.savedWorkouts;
};

export const useWorkoutsSearchQuery = (): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] => {
  const context = React.useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error(
      "useWorkoutsSearchQuery must be used within a WorkoutsProvider",
    );
  }
  return [context.searchQuery, context.setSearchQuery];
};

export const useWorkoutsFilters = (): [
  WorkoutFilters,
  React.Dispatch<React.SetStateAction<WorkoutFilters>>,
  number,
] => {
  const context = React.useContext(WorkoutsContext);
  if (context === undefined) {
    throw new Error(
      "useWorkoutsFilters must be used within a WorkoutsProvider",
    );
  }
  return [context.filters, context.setFilters, context.activeFilters];
};
