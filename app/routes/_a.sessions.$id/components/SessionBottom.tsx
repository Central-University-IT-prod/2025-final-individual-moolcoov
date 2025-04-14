import { useCallback, useEffect, useRef, useState } from "react";
import { Timer } from "./Timer";
import {
  completeExercise,
  completeRest,
  useSessionState,
  useSessionWorkout,
} from "~/features/session/model/SessionProvider";
import { ExerciseType } from "~/features/exercise/model/types";
import { getEquipmentLabel } from "~/shared/lib/equipment";
import { ExerciseNotesModal } from "~/features/exercise/ui/ExerciseNotesModal";
import { ExerciseProvider } from "~/features/exercise/model/ExerciseProvider";
import { AnimatePresence, motion } from "motion/react";
import { easingFunction } from "../route";

export const SessionBottom = () => {
  const { state } = useSessionState();

  return (
    <div className="mt-5 flex w-full items-end justify-end px-5">
      <AnimatePresence mode="wait">
        {(state.status === "start" || state.status === "rest") && (
          <RestTimer key="time" />
        )}
        {state.status === "exercise" && <ExerciseValue key="value" />}
      </AnimatePresence>
    </div>
  );
};

const RestTimer = () => {
  const { state, dispatch } = useSessionState();
  const [time, setTime] = useState(state.timer);
  const [animated, setAnimated] = useState(true);
  const hasCompletedRef = useRef(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setAnimated(true);
      setTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            completeRest(state, dispatch);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAdd = useCallback(() => {
    setAnimated(false);
    setTime((prev) => prev + 10);
  }, []);

  const onSubtract = useCallback(() => {
    setAnimated(false);
    setTime((prev) => Math.max(prev - 10, 0));
  }, []);

  return (
    <motion.div
      className="flex flex-col items-end gap-1.5"
      initial={{
        y: "20%",
        filter: "blur(10px)",
        opacity: 0,
      }}
      animate={{
        y: 0,
        filter: "blur(0)",
        opacity: 1,
        transition: { duration: 0.7, ease: easingFunction },
      }}
      exit={{
        y: "-8%",
        filter: "blur(10px)",
        opacity: 0,
        transition: { duration: 0.7, ease: easingFunction },
      }}
    >
      {state.status !== "start" && state.status !== "exercise" && (
        <div className="flex gap-2">
          <button
            className="bg-session-dark rounded-full px-3 py-2.5 text-xs font-medium backdrop-blur-xl transition-transform active:scale-[0.95]"
            onClick={onSubtract}
          >
            - 10 сек
          </button>
          <button
            className="bg-session-dark rounded-full px-3 py-2.5 text-xs font-medium backdrop-blur-xl transition-transform active:scale-[0.95]"
            onClick={onAdd}
          >
            + 10 сек
          </button>
        </div>
      )}

      <Timer seconds={time} animated={animated} />
    </motion.div>
  );
};

const ExerciseValue = () => {
  const { state } = useSessionState();
  const workout = useSessionWorkout();

  const exercise =
    workout.sections[state.currentSection ?? 0].exercises[
      state.currentExercise ?? 0
    ];
  const set = exercise.sets[state.currentSet ?? 0];
  const equipment = exercise.selectedEquipment;

  return (
    <ExerciseProvider exercise={exercise}>
      <motion.div
        className="flex flex-col items-end gap-1"
        initial={{
          y: "20%",
          filter: "blur(10px)",
          opacity: 0,
        }}
        animate={{
          y: 0,
          filter: "blur(0)",
          opacity: 1,
          transition: { duration: 0.7, ease: easingFunction },
        }}
        exit={{
          y: "-8%",
          filter: "blur(10px)",
          opacity: 0,
          transition: { duration: 0.7, ease: easingFunction },
        }}
      >
        <div className="flex gap-2">
          {equipment !== "body_weight" && (
            <div className="bg-session-dark rounded-full px-3 py-2.5 text-xs font-medium backdrop-blur-xl">
              {getEquipmentLabel(equipment)}, {set.weight ?? 5} кг
            </div>
          )}
          <ExerciseNotesModal>
            <button className="bg-session-dark rounded-full px-3 py-2.5 text-xs font-medium backdrop-blur-xl transition-transform active:scale-[0.95]">
              Заметки
            </button>
          </ExerciseNotesModal>
        </div>

        {exercise.type === ExerciseType.QUANTITY ? (
          <span className="flex h-[97.2px] items-center text-7xl font-black">
            {set.reps ?? 10} раз
          </span>
        ) : (
          <ExerciseValueTime seconds={set.time ?? 30} />
        )}
      </motion.div>
    </ExerciseProvider>
  );
};

const ExerciseValueTime = ({ seconds }: { seconds: number }) => {
  const { state, dispatch } = useSessionState();
  const workout = useSessionWorkout();
  const [time, setTime] = useState(seconds);
  const timerRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            completeExercise(state, dispatch, workout);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Timer seconds={time} />;
};

export default SessionBottom;
