import type { WorkoutSection } from "../model/types";

const SECTION_REST_TIME = 40;
const EXERCISE_REST_TIME = 20;

export const calculateWorkoutTime = (sections?: WorkoutSection[]) => {
  return (
    sections?.reduce(
      (acc, section) =>
        SECTION_REST_TIME +
        section.exercises.reduce(
          (acc, exercise) =>
            exercise.sets.reduce(
              (acc, set) =>
                (set.time ? acc + set.time : acc + 2) + EXERCISE_REST_TIME,
              acc,
            ),
          acc,
        ),
      0,
    ) ?? 0
  );
};
