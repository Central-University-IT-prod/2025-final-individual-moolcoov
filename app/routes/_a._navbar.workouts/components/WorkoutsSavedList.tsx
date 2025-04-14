import { Link } from "react-router";
import { useSavedWorkouts } from "~/features/workout/model/WorkoutsProvider";
import { WorkoutCardBig } from "~/features/workout/ui/WorkoutCard";
import { Carousel, CarouselContent, CarouselItem } from "~/shared/ui/Carousel";

export const WorkoutsSavedList = () => {
  const savedWorkouts = useSavedWorkouts();

  if (!savedWorkouts || savedWorkouts.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5">
      <h1 className="px-5 text-xl font-black lg:px-0">СОХРАНЁННЫЕ</h1>
      <Carousel className="w-full">
        <CarouselContent>
          {savedWorkouts.map((workout) => (
            <CarouselItem key={workout.id}>
              <Link to={`/workouts/${workout.id}`} className="block">
                <WorkoutCardBig workout={workout} />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};
