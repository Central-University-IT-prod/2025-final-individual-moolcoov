import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { motion } from "motion/react";
import React, { type CSSProperties } from "react";
import {
  useCancelSession,
  useSession,
  useSessionState,
  useSessionWorkout,
  useSetSession,
} from "~/features/session/model/SessionProvider";
import type { WorkoutSection } from "~/features/workout/model/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/shared/ui/DropdownMenu";
import { MoreIcon } from "~/shared/ui/icons/More";

export const SessionHeader = () => {
  const cancelSession = useCancelSession();

  return (
    <header className="flex w-full flex-col gap-3 px-5 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex w-full items-center justify-start gap-2">
          <WorkoutDurationTimer />
          <div className="text-lg font-black">·</div>
          <Progress />
        </div>
        <div className="flex w-full justify-center">
          <ExerciseLabel />
        </div>
        <div className="flex w-full justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-session-dark rounded-full px-2.5 py-2.5 text-xs font-medium backdrop-blur-xl transition-transform active:scale-[0.95]">
                <MoreIcon size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-red-500"
                onClick={cancelSession}
              >
                Отменить тренировку
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ProgressBar />
    </header>
  );
};

const WorkoutDurationTimer = () => {
  const session = useSession();
  const setSession = useSetSession();

  const [seconds, setSeconds] = React.useState(
    session.startedAt
      ? Math.round((new Date().getTime() - session.startedAt.getTime()) / 1000)
      : 0,
  );

  const timerRef = React.useRef<null | number>(null);

  React.useEffect(() => {
    setSession((prev) => ({
      ...prev,
      startedAt: prev.startedAt ?? new Date(),
    }));
  }, [setSession]);

  React.useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;

  return (
    <NumberFlowGroup>
      <div
        className="flex items-baseline text-lg font-black"
        style={
          {
            fontVariantNumeric: "tabular-nums",
            "--number-flow-char-height": "0.85em",
          } as CSSProperties
        }
      >
        <NumberFlow trend={1} value={mm} />
        <NumberFlow
          prefix=":"
          trend={1}
          value={ss}
          format={{ minimumIntegerDigits: 2 }}
        />
      </div>
    </NumberFlowGroup>
  );
};

const Progress = () => {
  const { state } = useSessionState();
  const workout = useSessionWorkout();

  const progress = React.useMemo(() => {
    return state.status === "finished"
      ? 100
      : calculateProgress(
          workout.sections,
          state.currentSection ?? 0,
          state.currentExercise ?? 0,
          state.currentSet ?? 0,
        );
  }, [workout, state]);

  return (
    <NumberFlow
      trend={1}
      value={progress}
      suffix="%"
      className="text-lg font-black"
    />
  );
};

const ExerciseLabel = () => {
  const { state } = useSessionState();
  const exercise =
    useSessionWorkout().sections[state.currentSection ?? 0].exercises[
      state.currentExercise ?? 0
    ];

  if (state.currentExercise === undefined || state.currentSet === undefined) {
    return;
  }

  return <div className="text-center text-xs font-bold">{exercise.title}</div>;
};

const ProgressBar = () => {
  const workout = useSessionWorkout();
  const { state } = useSessionState();

  const totalSets = React.useMemo(() => {
    return workout.sections.reduce((acc, section) => {
      return section.exercises.reduce((acc, exercise) => {
        return acc + exercise.sets.length;
      }, acc);
    }, 0);
  }, [workout]);

  return (
    <div className="flex w-full items-center gap-2">
      {workout.sections.map((section) => (
        <div
          key={section.id}
          className="bg-session-light h-[5px] overflow-hidden rounded-full backdrop-blur-sm"
          style={{
            width: `${(section.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0) / totalSets) * 100}%`,
          }}
        >
          {(state.currentSection ?? 0) + 1 >= section.id && (
            <motion.div
              className="h-full w-[1%] rounded-full bg-white"
              animate={{
                width:
                  state.status === "finished"
                    ? "100%"
                    : (state.currentSection ?? 0) + 1 <= section.id
                      ? `max(10%, ${((state.currentExercise ?? 0) / section.exercises.length) * 100}%)`
                      : "100%",
              }}
            ></motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export function calculateProgress(
  sections: WorkoutSection[],
  currentSection: number,
  currentExercise: number,
  currentSet: number,
): number {
  let totalSets = 0;
  let completedSets = 0;

  for (let s = 0; s < sections.length; s++) {
    for (let e = 0; e < sections[s].exercises.length; e++) {
      for (let set = 0; set < sections[s].exercises[e].sets.length; set++) {
        totalSets++;
        if (
          s < currentSection ||
          (s === currentSection && e < currentExercise) ||
          (s === currentSection && e === currentExercise && set < currentSet)
        ) {
          completedSets++;
        }
      }
    }
  }

  return Math.round((completedSets / totalSets) * 100);
}
