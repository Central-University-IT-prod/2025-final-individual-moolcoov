import React from "react";
import type { Exercise } from "~/features/exercise/model/types";

interface ExercisesContextType {
  exercise: Exercise;
  setExercise: React.Dispatch<React.SetStateAction<Exercise>>;
}

const ExercisesContext = React.createContext<ExercisesContextType | undefined>(
  undefined,
);

interface ExercisesProviderProps {
  exercise: Exercise;
  children?: React.ReactNode;
}

export const ExerciseProvider = ({
  exercise: defExercise,
  children,
}: ExercisesProviderProps) => {
  const [exercise, setExercise] = React.useState(defExercise);

  return (
    <ExercisesContext.Provider
      value={{
        exercise,
        setExercise,
      }}
    >
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercise = (): [
  Exercise,
  React.Dispatch<React.SetStateAction<Exercise>>,
] => {
  const context = React.useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error("useExercise must be used within a ExerciseProvider");
  }
  return [context.exercise, context.setExercise];
};
