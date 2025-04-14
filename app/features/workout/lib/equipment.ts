import type { EquipmentType } from "~/shared/lib/equipment";
import type { WorkoutSection } from "../model/types";

export const getEquipmentFromExercises = (sections?: WorkoutSection[]) => {
  return (
    sections
      ?.reduce(
        (acc, section) =>
          acc.concat(
            section.exercises.reduce(
              (acc, exercise) => acc.concat(exercise.selectedEquipment),
              [] as EquipmentType[],
            ),
          ),
        [] as EquipmentType[],
      )
      .filter((e, i, a) => a.indexOf(e) === i) ?? []
  );
};
