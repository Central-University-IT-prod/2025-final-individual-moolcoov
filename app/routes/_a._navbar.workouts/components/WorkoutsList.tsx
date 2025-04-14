import { Link } from "react-router";
import {
  useWorkouts,
  useWorkoutsFilters,
  useWorkoutsSearchQuery,
} from "~/features/workout/model/WorkoutsProvider";
import { WorkoutCardSmall } from "~/features/workout/ui/WorkoutCard";
import { WorkoutCreateModal } from "~/features/workout/ui/WorkoutCreateModal";
import { WorkoutsFiltersModal } from "~/features/workout/ui/WorkoutsFiltersModal";
import { pluralize } from "~/shared/lib/pluralize";
import { Button } from "~/shared/ui/Button";
import { FiltersButton } from "~/shared/ui/FiltersButton";
import { PlusIcon } from "~/shared/ui/icons";

export const WorkoutsList = () => {
  const workouts = useWorkouts();

  return (
    <section className="flex flex-col gap-6 px-5 lg:px-0">
      <ListHeader />
      <div className="grid grid-cols-2 gap-3.5">
        {workouts.map((workout) => (
          <Link key={workout.id} to={`/workouts/${workout.id}`}>
            <WorkoutCardSmall workout={workout} />
          </Link>
        ))}
      </div>
    </section>
  );
};

const ListHeader = () => {
  const workouts = useWorkouts();
  const [, , activeFilters] = useWorkoutsFilters();
  const [searchQuery] = useWorkoutsSearchQuery();

  if (searchQuery !== "") {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-black">
          {pluralize(workouts.length, [
            "ТРЕНИРОВКА",
            "ТРЕНИРОВКИ",
            "ТРЕНИРОВОК",
          ])}
        </h1>
        <WorkoutsFiltersModal asChild>
          <FiltersButton activeFilters={activeFilters} />
        </WorkoutsFiltersModal>
      </div>
      <WorkoutCreateModal>
        <Button variant={"secondary"}>
          <PlusIcon size={18} />
          <span>НОВАЯ ТРЕНИРОВКА</span>
        </Button>
      </WorkoutCreateModal>
    </div>
  );
};
