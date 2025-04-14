import { AnimatePresence, motion } from "motion/react";
import { getMediaFromDB } from "~/features/media/model/db";
import { getEquipmentLabel } from "~/shared/lib/equipment";
import { useDatabase } from "~/shared/lib/indexedDB";
import type { Exercise } from "../model/types";
import React from "react";

export const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const { data: image } = useDatabase(async () =>
    getMediaFromDB(exercise.image?.storedId),
  );

  const imageSrc = React.useMemo(
    () =>
      image ? URL.createObjectURL(image.data) : exercise.image?.externalSrc,
    [image, exercise.image?.externalSrc],
  );

  return (
    <div className="flex h-[60px] items-center gap-5 overflow-hidden">
      <div className="bg-background-200 relative aspect-square h-full w-full max-w-[60px] min-w-[60px] overflow-hidden rounded-2xl object-cover object-center">
        <AnimatePresence>
          {imageSrc && (
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-full w-full object-cover object-center"
              src={imageSrc}
              alt={exercise.title}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="flex w-full flex-col items-start gap-1.5 overflow-hidden">
        <h3 className="text-base">
          <span className="font-bold">{exercise.title}</span>
        </h3>
        {exercise.equipment && (
          <p className="text-muted-foreground overflow-hidden text-sm font-medium overflow-ellipsis whitespace-nowrap">
            {exercise.equipment.map((e) => getEquipmentLabel(e)).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
};
