import { AnimatePresence, motion } from "motion/react";
import React from "react";
import type { Exercise } from "~/features/exercise/model/types";
import { getMediaFromDB } from "~/features/media/model/db";
import {
  useSessionState,
  useSessionWorkout,
} from "~/features/session/model/SessionProvider";
import { useDatabase } from "~/shared/lib/indexedDB";

export const SessionCover = () => {
  const { state } = useSessionState();

  return (
    <div className="absolute inset-0 h-screen w-screen flex-1 overflow-hidden lg:static lg:h-full lg:rounded-4xl lg:border">
      <div className="absolute inset-0 z-[5] h-full w-full bg-black/40"></div>
      <AnimatePresence>
        {state.status === "exercise" && <ExerciseVideoWrapper />}
      </AnimatePresence>
    </div>
  );
};

const ExerciseVideoWrapper = () => {
  const { state } = useSessionState();
  const workout = useSessionWorkout();

  if (
    state.currentSection === undefined ||
    state.currentExercise === undefined
  ) {
    return null;
  }

  const exercise =
    workout.sections[state.currentSection].exercises[state.currentExercise];

  return <ExerciseVideo exercise={exercise} key={"video"} />;
};

const ExerciseVideo = ({ exercise }: { exercise: Exercise }) => {
  const { data: video } = useDatabase(async () =>
    getMediaFromDB(exercise.video?.storedId),
  );

  const url = React.useMemo(
    () =>
      video ? URL.createObjectURL(video.data) : exercise.video?.externalSrc,
    [video, exercise.video?.externalSrc],
  );

  React.useEffect(() => {
    return () => {
      if (video && url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [video, url]);

  if (!url) {
    return null;
  }

  return (
    <motion.video
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      autoPlay
      loop
      muted
      playsInline
      src={url}
      className="h-full w-full object-cover object-center"
    />
  );
};
