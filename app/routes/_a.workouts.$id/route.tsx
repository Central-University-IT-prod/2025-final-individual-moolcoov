import { type Workout } from "~/features/workout/model/types";
import { WorkoutProvider } from "./components/WorkoutProvider";
import { WorkoutHeader } from "./components/WorkoutHeader";
import { WorkoutButton } from "./components/WorkoutButton";
import { WorkoutActions } from "./components/WorkoutActions";
import { WorkoutExercises } from "./components/WorkoutExercises";
import { Difficulty } from "~/shared/types/difficulty";
import { Button } from "~/shared/ui/Button";
import { XmarkIcon } from "~/shared/ui/icons";
import { useNavigate, useNavigationType } from "react-router";
import type { UUID } from "~/shared/types/uuid";
import { getWorkoutFromDB } from "~/features/workout/model/db";
import { useDatabase } from "~/shared/lib/indexedDB";
import { AnimatePresence } from "motion/react";
import { Loading } from "~/shared/ui/Loading";

export default function WorkoutPage({
  params: { id },
}: {
  params: { id: UUID };
}) {
  const { data: workout, loading } = useDatabase(async () =>
    getWorkoutFromDB(id),
  );

  const navigate = useNavigate();
  const navigationType = useNavigationType();

  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence>
        {loading && <Loading key={"loading"} className="h-screen w-screen" />}
        {workout && (
          <WorkoutProvider workout={workout}>
            <div className="m-auto max-w-5xl justify-center gap-6 pb-[84px] lg:relative lg:flex lg:h-svh lg:overflow-hidden lg:px-6 lg:pb-0">
              <Button
                variant={"secondary"}
                size={"icon"}
                className="fixed top-5 left-5 z-30 lg:absolute lg:top-6 lg:right-6 lg:left-auto"
                onClick={() => {
                  if (navigationType === "POP") {
                    navigate("/workouts");
                    return;
                  }

                  navigate(-1);
                }}
              >
                <XmarkIcon size={19} />
              </Button>

              <div className="flex w-full min-w-0 flex-col lg:h-svh lg:max-h-[1058px] lg:flex-1 lg:gap-3 lg:py-6">
                <WorkoutHeader />
                <WorkoutActions />
                <WorkoutButton />
              </div>
              <WorkoutExercises />
            </div>
          </WorkoutProvider>
        )}
      </AnimatePresence>
    </div>
  );
}
