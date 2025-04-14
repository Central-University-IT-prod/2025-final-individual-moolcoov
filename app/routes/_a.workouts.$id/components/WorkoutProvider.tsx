import React from "react";
import type { Workout } from "~/features/workout/model/types";

interface WorkoutContextType {
  workout: Workout;
}

const WorkoutContext = React.createContext<WorkoutContextType | undefined>(
  undefined,
);

interface WorkoutProviderProps {
  workout: Workout;
  children: React.ReactNode;
}

export const WorkoutProvider = ({
  workout,
  children,
}: WorkoutProviderProps) => {
  return (
    <WorkoutContext.Provider value={{ workout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = React.useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context.workout;
};
