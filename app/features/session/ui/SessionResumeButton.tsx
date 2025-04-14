import { calculateProgress } from "~/routes/_a.sessions.$id/components/SessionHeader";
import type { WorkoutSession } from "../model/types";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import React, { type CSSProperties } from "react";
import { XmarkIcon } from "~/shared/ui/icons";
import { Link } from "react-router";
import { useSessionsStore } from "../model/store";

export const SessionResumeButton = ({
  session,
}: {
  session: WorkoutSession;
}) => {
  const updateSession = useSessionsStore((state) => state.updateSession);

  const [seconds, setSeconds] = React.useState(
    session.startedAt
      ? Math.round((new Date().getTime() - session.startedAt.getTime()) / 1000)
      : 0,
  );

  const timerRef = React.useRef<null | number>(null);

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

  const onCancel = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await updateSession({ ...session, canceled: true });
    },
    [updateSession, session],
  );

  return (
    <Link to={`/sessions/${session.id}`}>
      <div className="bg-background-200 relative flex flex-col gap-1 rounded-3xl border px-5 py-4">
        <button
          className="text-muted-foreground absolute top-3 right-4 z-10 p-2"
          onClick={onCancel}
        >
          <XmarkIcon size={14} />
        </button>
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-medium">
            Продолжить тренировку
          </p>
          <h2 className="font-medium-sans text-lg">руки и ноги</h2>
        </div>
        <div className="text-muted-foreground mt-[-2px] flex w-full items-center gap-2">
          <NumberFlowGroup>
            <div
              className="flex items-baseline font-bold"
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
          <div className="font-bold">·</div>
          <NumberFlow
            trend={1}
            value={calculateProgress(
              session.workout.sections,
              session.section ?? 0,
              session.exercise ?? 0,
              session.set ?? 0,
            )}
            suffix="%"
            className="font-bold"
          />
        </div>
      </div>
    </Link>
  );
};
