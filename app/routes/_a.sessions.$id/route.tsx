import { redirect } from "react-router";
import {
  getSessionFromDB,
  updateSessionInDB,
} from "~/features/session/model/db";
import { SessionProvider } from "~/features/session/model/SessionProvider";
import type {
  WorkoutSession,
  WorkoutSessionResults,
} from "~/features/session/model/types";
import type { UUID } from "~/shared/types/uuid";
import { SessionHeader } from "./components/SessionHeader";
import { SessionTop } from "./components/SessionTop";
import { SessionButton } from "./components/SessionButton";
import { SessionBottom } from "./components/SessionBottom";
import { SessionCover } from "./components/SessionImage";
import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { SessionResults } from "./components/SessionResults";
import { getUser } from "~/features/user/model/storage";
import { calculateXP } from "~/features/user/lib/xp";
import { calculateCoins } from "~/features/user/lib/coins";
import { useSessionsStore } from "~/features/session/model/store";
import { useUserStore } from "~/features/user/model/store";

export const easingFunction = [0.33, 1, 0.68, 1];

export const clientLoader = async ({
  params: { id },
}: {
  params: { id: UUID };
}) => {
  const session = await getSessionFromDB(id);

  if (!session) {
    return redirect("/workouts");
  }

  return { session };
};

export default function SessionPage({
  loaderData: { session: sessionRef },
}: {
  loaderData: { session: WorkoutSession };
}) {
  const fetchSessions = useSessionsStore((state) => state.fetchSessions);
  const updateUser = useUserStore((state) => state.updateUser);
  const [completed, setCompleted] = React.useState(sessionRef.completed);
  const [results, setResults] = React.useState<
    WorkoutSessionResults | undefined
  >(sessionRef.results);

  const onComplete = React.useCallback(
    async (session: WorkoutSession) => {
      if (completed) {
        return;
      }

      const trainingTime = Math.round(
        ((session.completedAt ?? new Date()).getTime() -
          (session.startedAt ?? new Date()).getTime()) /
          60000,
      );
      const totalWeight = session.workout.sections.reduce((acc, section) => {
        return section.exercises.reduce((acc, section) => {
          return section.sets.reduce((acc, set) => {
            return acc + (set.weight ?? 0);
          }, acc);
        }, acc);
      }, 0);

      const user = getUser();

      const localResults = {
        xp: {
          prev: user?.xp ?? 0,
          new: (user?.xp ?? 0) + calculateXP(trainingTime, totalWeight),
        },

        coins: {
          prev: user?.coins ?? 0,
          new: (user?.coins ?? 0) + calculateCoins(trainingTime, totalWeight),
        },
      };

      if (user) {
        updateUser({
          ...user,
          xp: localResults.xp.new,
          coins: localResults.coins.new,
        });
      }

      setResults(localResults);

      await updateSessionInDB({
        ...session,
        completed: true,
        completedAt: new Date(),
        results: localResults,
      });

      await fetchSessions();

      setCompleted(true);
    },
    [setCompleted, setResults],
  );

  return (
    <SessionProvider session={sessionRef} onComplete={onComplete}>
      <AnimatePresence mode="wait">
        {!completed && (
          <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.5 } }}
            className="relative m-auto flex h-[100svh] w-full flex-col gap-5 overflow-hidden lg:max-h-[1080px] lg:max-w-7xl lg:flex-row lg:p-6"
            key="session"
          >
            <SessionCover />
            <div className="z-10 flex h-full flex-1 flex-col">
              <SessionHeader />
              <SessionTop />
              <SessionBottom />
              <SessionButton />
            </div>
          </motion.div>
        )}
        {completed && <SessionResults key="results" results={results} />}
      </AnimatePresence>
    </SessionProvider>
  );
}
