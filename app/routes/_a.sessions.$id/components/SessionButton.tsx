import { AnimatePresence, motion } from "motion/react";
import { ExerciseType } from "~/features/exercise/model/types";
import {
  completeExercise,
  completeRest,
  useSessionState,
  useSessionWorkout,
} from "~/features/session/model/SessionProvider";
import { Button } from "~/shared/ui/Button";

export const SessionButton = () => {
  const { state, dispatch } = useSessionState();
  const workout = useSessionWorkout();
  const exercise =
    workout.sections[state.currentSection ?? 0].exercises[
      state.currentExercise ?? 0
    ];

  return (
    <div className="mt-5 px-5 pb-3">
      <AnimatePresence mode="wait">
        {(state.status === "start" || state.status === "rest") && (
          <motion.div key="rest" className="rounded-full backdrop-blur-xl">
            <Button
              variant={"secondary"}
              className="bg-session-dark backdrop-blur-xl"
              onClick={() => completeRest(state, dispatch)}
            >
              ПРОПУСТИТЬ ОТДЫХ
            </Button>
          </motion.div>
        )}

        {state.status === "exercise" &&
          exercise.type === ExerciseType.QUANTITY && (
            <motion.div
              key="quantity"
              className="rounded-full backdrop-blur-xl"
            >
              <Button
                onClick={() => completeExercise(state, dispatch, workout)}
              >
                ГОТОВО
              </Button>
            </motion.div>
          )}

        {state.status === "exercise" &&
          exercise.type === ExerciseType.TIMED && (
            <motion.div key="timed" className="rounded-full backdrop-blur-xl">
              <Button
                variant={"secondary"}
                className="bg-session-dark backdrop-blur-xl"
                onClick={() => completeExercise(state, dispatch, workout)}
              >
                ПРОПУСТИТЬ УПРАЖНЕНИЕ
              </Button>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};
