import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import React from "react";
import { ExerciseType } from "~/features/exercise/model/types";
import {
  useSessionState,
  useSessionWorkout,
} from "~/features/session/model/SessionProvider";
import type { WorkoutExercise } from "~/features/workout/model/types";
import { WorkoutExerciseCard } from "~/features/workout/ui/WorkoutExerciseCard";
import { cn } from "~/shared/lib/utils";
import { easingFunction } from "../route";

export const SessionTop = () => {
  const { state } = useSessionState();

  return (
    <div className="mt-7 w-full flex-1 overflow-y-auto px-5">
      <AnimatePresence mode="wait">
        {state.status === "start" && <SectionsStart key="start" />}

        {(state.status === "exercise" || state.restType === "set") && (
          <Exercise key={"exercise"} />
        )}

        {state.restType === "exercise" && <ExercisesRest key="exerciseRest" />}
        {state.restType === "section" && <SectionsRest key="sectionRest" />}
      </AnimatePresence>
    </div>
  );
};

const SectionsStart = () => {
  const workout = useSessionWorkout();

  return (
    <motion.div
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
      className="flex flex-col gap-5 will-change-transform"
    >
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Начало</p>
        <h1 className="text-4xl font-black text-balance uppercase">
          {workout.sections.at(0)?.title ?? "Блок без названия"}
        </h1>
      </div>
      <ExercisesList
        exercises={workout.sections.at(0)?.exercises.slice(0, 4) ?? []}
      />
    </motion.div>
  );
};

const SectionsRest = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, 2000);
    return () => clearTimeout(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {index === 0 && <SectionsDone key="done" />}
      {index === 1 && <SectionsNext key="next" />}
    </AnimatePresence>
  );
};

const SectionsDone = () => {
  return (
    <motion.div
      className="flex flex-col gap-2"
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
        transition: { duration: 0.6, ease: easingFunction },
      }}
    >
      <p className="text-lg font-bold">Блок завершён</p>
      <h1 className="text-4xl font-black">Отдых</h1>
    </motion.div>
  );
};

const SectionsNext = () => {
  const { state } = useSessionState();
  const workout = useSessionWorkout();

  const nextSection = workout.sections[state.currentSection ?? 0];

  return (
    <motion.div
      className="flex flex-col gap-5"
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
      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold">Далее</p>
        <h1 className="text-4xl font-black text-balance uppercase">
          {nextSection.title}
        </h1>
      </div>
      <ExercisesList exercises={nextSection.exercises.slice(0, 4)} />
    </motion.div>
  );
};

const ExercisesRest = () => {
  const { state } = useSessionState();
  const workout = useSessionWorkout();
  const section = workout.sections[state.currentSection ?? 0];

  return (
    <motion.div
      className="flex flex-col gap-5"
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
      <h1 className="text-4xl font-black">Отдых</h1>
      <div className="flex flex-col gap-3.5">
        <h2 className="text-lg font-bold">Следующие упражнения</h2>
        <ExercisesList
          exercises={section.exercises.slice(
            state.currentExercise,
            (state.currentExercise ?? 0) + 4,
          )}
        />
      </div>
    </motion.div>
  );
};

const Exercise = () => {
  const { state } = useSessionState();
  const workout = useSessionWorkout();
  const section = workout.sections[state.currentSection ?? 0];
  const exercise = section.exercises[state.currentExercise ?? 0];

  const sets = React.useMemo(
    () =>
      state.status === "exercise"
        ? [exercise.sets[state.currentSet ?? 0]]
        : exercise.sets,
    [exercise.sets, state.currentSet, state.status],
  );

  if (!exercise) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col gap-5"
      initial={{ y: "20%", filter: "blur(10px)", opacity: 0 }}
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
        transition: { duration: 0.8, ease: easingFunction },
      }}
    >
      <AnimatePresence>
        {!state.restType ? (
          <motion.h1
            key={"exercise"}
            className="text-4xl font-black"
            initial={{
              y: "15px",
              filter: "blur(2px)",
              opacity: 0,
              position: "absolute",
            }}
            animate={{
              y: 0,
              filter: "blur(0)",
              opacity: 1,
              position: "relative",
            }}
            exit={{
              y: "-15px",
              filter: "blur(2px)",
              opacity: 0,
              position: "absolute",
            }}
            transition={{
              duration: 0.6,
              ease: easingFunction,
            }}
          >
            {exercise.title}
          </motion.h1>
        ) : (
          <motion.h1
            key={"rest"}
            className="text-4xl font-black"
            initial={{
              y: "15px",
              filter: "blur(2px)",
              opacity: 0,
              position: "absolute",
            }}
            animate={{
              y: 0,
              filter: "blur(0)",
              opacity: 1,
              position: "relative",
            }}
            exit={{
              y: "-15px",
              filter: "blur(2px)",
              opacity: 0,
              position: "absolute",
            }}
            transition={{
              duration: 0.6,
              ease: easingFunction,
            }}
          >
            Отдых
          </motion.h1>
        )}
      </AnimatePresence>

      <table className="w-fit">
        <thead className="border-session-light border-b text-sm text-[#BDBDBD]">
          <tr className="*:py-2 *:font-medium *:not-first:pl-3.5 *:not-last:pr-3.5">
            <td>Сет</td>
            <td>Вес</td>
            <td>
              {exercise.type === ExerciseType.TIMED ? "Время" : "Повторений"}
            </td>
          </tr>
        </thead>
        <tbody className="*:px-5 *:py-2 [&>tr>td]:py-3 [&>tr>td]:font-semibold [&>tr>td>input]:outline-none">
          <LayoutGroup id={`${section.id}_${exercise.id}`}>
            {sets.map((set) => (
              <motion.tr
                key={set.id}
                className={cn("*:not-first:pl-3.5 *:not-last:pr-3.5", {
                  "text-green-200": set.id < (state.currentSet ?? 0) + 1,
                  "text-muted-foreground": set.id > (state.currentSet ?? 0) + 1,
                  "font-bold": set.id > (state.currentSet ?? 0) + 1,
                })}
              >
                <td>{set.id}</td>
                <td>
                  {exercise.selectedEquipment === "body_weight" ? (
                    <>--</>
                  ) : (
                    <>{set.weight} кг</>
                  )}
                </td>
                <td>
                  {exercise.type === ExerciseType.TIMED ? (
                    <>{set.time} сек</>
                  ) : (
                    <>{set.reps}x</>
                  )}
                </td>
              </motion.tr>
            ))}
          </LayoutGroup>
        </tbody>
      </table>
    </motion.div>
  );
};

const ExercisesList = ({ exercises }: { exercises: WorkoutExercise[] }) => {
  const [imageShown, setImageShown] = React.useState(false);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setImageShown(true);
    }, 700);
    return () => clearTimeout(interval);
  }, []);

  return (
    <motion.div
      className="flex flex-col gap-5"
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
    >
      {exercises.map((exercise) => (
        <WorkoutExerciseCard
          key={exercise.id}
          exercise={exercise}
          imageShown={imageShown}
        />
      ))}
    </motion.div>
  );
};
