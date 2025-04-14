import dayjs from "dayjs";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import {
  useSession,
  useSessionWorkout,
} from "~/features/session/model/SessionProvider";
import "dayjs/locale/ru";
import { InfoColumn } from "~/shared/ui/InfoColumn";
import { Button } from "~/shared/ui/Button";
import { calculateXP, getXPLevel, LEVEL_TO_XP } from "~/features/user/lib/xp";
import { Link, useNavigate } from "react-router";
import React, { type CSSProperties } from "react";
import { DumbBellColoredIcon, LottieCoinIcon } from "~/shared/ui/icons";
import NumberFlow from "@number-flow/react";
import type { WorkoutSessionResults } from "~/features/session/model/types";

const animations = {
  initial: {
    opacity: 0,
    transform: "translateX(100%)",
  },
  animate: {
    opacity: 1,
    transform: "none",
  },
  exit: {
    opacity: 0,
    transform: "translateX(-100%)",
  },
  transition: {
    duration: 0.4,
    ease: "easeInOut",
  },
};

export const SessionResults = ({
  results,
}: {
  results?: WorkoutSessionResults;
}) => {
  const navigate = useNavigate();
  const [index, setIndex] = React.useState(0);

  const next = React.useCallback(() => {
    if (index === 2) {
      navigate("/workouts");
      return;
    }

    setIndex((prev) => prev + 1);
  }, [index]);

  return (
    <div className="relative flex h-[100svh] flex-col overflow-hidden">
      <AnimatePresence>
        {index === 0 && <InfoPage key="info" next={next} results={results} />}
        {index === 1 && <XPPage key="xp" next={next} results={results} />}
        {index === 2 && <CoinsPage key="coins" next={next} results={results} />}
      </AnimatePresence>
    </div>
  );
};

const InfoPage = ({
  next,
  results,
}: {
  next: () => void;
  results?: WorkoutSessionResults;
}) => {
  const session = useSession();
  const workout = useSessionWorkout();

  const workoutTime = Math.round(
    ((session.completedAt ?? new Date()).getTime() -
      (session.startedAt ?? new Date()).getTime()) /
      60000,
  );
  const totalWeight = workout.sections.reduce((acc, section) => {
    return section.exercises.reduce((acc, section) => {
      return section.sets.reduce((acc, set) => {
        return acc + (set.weight ?? 0);
      }, acc);
    }, acc);
  }, 0);

  return (
    <motion.div
      className="absolute h-[100svh] w-screen overflow-hidden px-5 pt-6 pb-(--bottom-button) text-center lg:py-6"
      {...(animations as HTMLMotionProps<"div">)}
    >
      <div className="m-auto flex h-full w-full flex-col items-center justify-between gap-8 lg:max-w-xl lg:gap-12">
        <p className="font-medium">Тренировка завершена</p>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-lg font-bold">
            {dayjs(session.startedAt)
              .locale("ru")
              .format("DD MMMM YYYY, dddd")
              .toString()}
          </p>
          <h1 className="font-medium-sans text-4xl font-normal">
            {workout.title}
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-8 lg:gap-11">
          <InfoColumn
            info={
              <h2 className="font-medium-sans text-xl">{workoutTime} мин</h2>
            }
            label="Время тренировки"
          />
          <InfoColumn
            info={
              <h2 className="font-medium-sans text-xl">
                {workout.sections.reduce((acc, section) => {
                  return section.exercises.reduce((acc, section) => {
                    return section.sets.reduce((acc, set) => {
                      return acc + (set.reps ?? 0);
                    }, acc);
                  }, acc);
                }, 0)}
              </h2>
            }
            label="Всего повторений"
          />
          <InfoColumn
            info={
              <h2 className="font-medium-sans text-xl">{totalWeight} кг</h2>
            }
            label="Поднятый вес"
          />
          {results?.xp.new != undefined && results?.xp.prev != undefined && (
            <InfoColumn
              info={
                <h2 className="font-medium-sans text-xl">
                  {results?.xp.new - results?.xp.prev} XP
                </h2>
              }
              label="Опыта получено"
            />
          )}
        </div>

        <Button onClick={next}>ДАЛЕЕ</Button>
      </div>
    </motion.div>
  );
};

const XPPage = ({
  next,
  results,
}: {
  next: () => void;
  results?: WorkoutSessionResults;
}) => {
  const [level, setLevel] = React.useState(getXPLevel(results?.xp.prev));

  const [xpPercentage, setXpPercentage] = React.useState(0);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setLevel(getXPLevel(results?.xp.new));
    }, 800);
    return () => clearTimeout(interval);
  }, []);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setXpPercentage(
        (((results?.xp.new ?? 0) % LEVEL_TO_XP) / LEVEL_TO_XP) * 100,
      );
    }, 2100);
    return () => clearTimeout(interval);
  }, [results?.xp.prev, results?.xp.new]);

  return (
    <motion.div
      className="absolute h-[100svh] w-screen px-5 pt-6 pb-(--bottom-button) lg:py-6"
      {...(animations as HTMLMotionProps<"div">)}
    >
      <div className="m-auto flex h-full w-full flex-col items-center justify-between gap-8 lg:max-w-xl lg:gap-12">
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <DumbBellColoredIcon size={64} />
              <NumberFlow
                className="text-xp text-6xl font-black"
                value={level}
                trend={1}
                style={
                  {
                    fontVariantNumeric: "tabular-nums",
                    "--number-flow-char-height": "0.85em",
                  } as CSSProperties
                }
              />
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1, duration: 1 } }}
              className="text-xp text-center text-3xl font-black"
            >
              {getXPLevel(results?.xp.prev) != getXPLevel(results?.xp.new)
                ? "НОВЫЙ УРОВЕНЬ"
                : "УРОВЕНЬ"}
            </motion.h2>
          </div>
          <div className="flex w-full flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1, delay: 1.8 } }}
              className="bg-muted h-[30px] w-full rounded-full"
            >
              <motion.div
                animate={{
                  width: `max(10%, ${xpPercentage}%`,
                  transition: { duration: 1.2 },
                }}
                className="bg-xp h-full w-[10%] rounded-full"
              ></motion.div>
            </motion.div>
            <motion.p
              className="text-muted-foreground font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1, delay: 2.2 } }}
            >
              До следующего уровня:{" "}
              {LEVEL_TO_XP - ((results?.xp.new ?? 0) % LEVEL_TO_XP)} XP
            </motion.p>
          </div>
        </div>
        <Button onClick={next}>ДАЛЕЕ</Button>
      </div>
    </motion.div>
  );
};

const CoinsPage = ({
  next,
  results,
}: {
  next: () => void;
  results?: WorkoutSessionResults;
}) => {
  const [coins, setCoins] = React.useState(0);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      setCoins((results?.coins.new ?? 0) - (results?.coins.prev ?? 0));
    }, 1000);
    return () => clearTimeout(interval);
  }, []);

  return (
    <motion.div
      className="absolute h-[100svh] w-screen px-5 pt-6 pb-(--bottom-button) lg:py-6"
      {...(animations as HTMLMotionProps<"div">)}
    >
      <div className="m-auto flex h-full w-full flex-col items-center justify-between gap-8 lg:max-w-xl lg:gap-12">
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-12">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <LottieCoinIcon size={64} />
              <NumberFlow
                className="text-lottie text-6xl font-black"
                value={coins}
                trend={1}
                style={
                  {
                    fontVariantNumeric: "tabular-nums",
                    "--number-flow-char-height": "0.85em",
                  } as CSSProperties
                }
              />
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.3, duration: 1 } }}
              className="text-lottie text-center text-3xl font-black"
            >
              ЛОТТИ-КОИНОВ ПОЛУЧЕНО
            </motion.h2>
          </div>
        </div>
        <Button onClick={next}>ДАЛЕЕ</Button>
      </div>
    </motion.div>
  );
};
