import { useExercises } from "~/features/exercise/model/ExercisesProvider";
import { ExerciseCard } from "~/features/exercise/ui/ExerciseCard";
import { ExerciseModal } from "~/features/exercise/ui/ExerciseModal";

export const ExercisesList = () => {
  const exercises = useExercises();

  return (
    <div className="flex flex-col gap-4">
      {exercises.map((exercise) => (
        <ExerciseModal key={exercise.id} id={exercise.id}>
          <ExerciseCard exercise={exercise} />
        </ExerciseModal>
      ))}
    </div>
  );
};
