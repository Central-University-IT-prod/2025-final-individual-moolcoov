import { useWorkout } from "./WorkoutProvider";
import { TagBadge } from "~/shared/ui/Tag";
import { InfoColumn } from "~/shared/ui/InfoColumn";
import { useDatabase } from "~/shared/lib/indexedDB";
import { getMediaFromDB } from "~/features/media/model/db";
import React from "react";
import { motion } from "motion/react";
import { secondsToMinutes } from "~/shared/lib/time";
import { getDifficultyIcon, getDifficultyLabel } from "~/shared/lib/difficulty";

export const WorkoutHeader = () => {
  const workout = useWorkout();
  const { data: image } = useDatabase(async () =>
    getMediaFromDB(workout.image?.storedId),
  );

  const imageSrc = React.useMemo(
    () =>
      image ? URL.createObjectURL(image.data) : workout.image?.externalSrc,
    [image, workout.image?.externalSrc],
  );

  const DifficultyIcon = getDifficultyIcon(workout.difficulty);

  return (
    <header className="relative flex h-[75vh] w-full flex-col items-center justify-end text-center lg:h-full">
      <div className="absolute inset-0 h-full w-full overflow-hidden lg:relative lg:h-full lg:w-full lg:rounded-3xl lg:border">
        <div className="absolute inset-0 z-[5] bg-black/20" />
        <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black to-transparent to-40% lg:hidden" />

        {imageSrc && (
          <motion.img
            src={imageSrc}
            alt={workout.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 aspect-6/7 h-full w-full object-cover object-center"
          />
        )}
      </div>

      <div className="z-10 flex w-full flex-col items-center lg:mt-6">
        <h1 className="font-medium-sans text-3xl text-balance">
          {workout.title}
        </h1>
        {workout.tags && (
          <div className="mt-3 flex gap-2">
            {workout.tags.map((tag) => (
              <TagBadge dark key={tag.id} tag={tag} />
            ))}
          </div>
        )}
        <div className="mt-6 flex w-full items-center px-6">
          <InfoColumn
            info={
              <span className="text-xl font-black">
                {secondsToMinutes(workout.workoutTime)} мин
              </span>
            }
            label="Время тренировки"
          />
          <InfoColumn
            info={<DifficultyIcon size={25} />}
            label={getDifficultyLabel(workout.difficulty)}
          />
        </div>
      </div>
    </header>
  );
};
