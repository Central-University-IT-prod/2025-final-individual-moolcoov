import { FiltersButton } from "~/shared/ui/FiltersButton";
import {
  useExercises,
  useExercisesFilters,
  useExercisesSearchQuery,
} from "~/features/exercise/model/ExercisesProvider";
import { ExercisesFiltersModal } from "~/features/exercise/ui/ExercisesFiltersModal";
import { pluralize } from "~/shared/lib/pluralize";

export const ExercisesInfo = () => {
  const exercises = useExercises();
  const [searchQuery] = useExercisesSearchQuery();
  const [, , activeFilters] = useExercisesFilters();

  if (searchQuery !== "") {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black">
        {pluralize(exercises.length, [
          "УПРАЖНЕНИЕ",
          "УПРАЖНЕНИЯ",
          "УПРАЖНЕНИЙ",
        ])}
      </h2>
      <ExercisesFiltersModal asChild>
        <FiltersButton activeFilters={activeFilters} />
      </ExercisesFiltersModal>
    </div>
  );
};
