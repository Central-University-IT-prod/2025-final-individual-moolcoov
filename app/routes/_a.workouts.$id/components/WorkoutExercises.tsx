import { WorkoutExerciseCard } from "~/features/workout/ui/WorkoutExerciseCard";
import { useWorkout } from "./WorkoutProvider";
import React from "react";
import {
  ExerciseProvider,
  useExercise,
} from "~/features/exercise/model/ExerciseProvider";
import { ExerciseType } from "~/features/exercise/model/types";
import {
  ExerciseVideo,
  ExerciseActionButton,
} from "~/features/exercise/ui/ExerciseModal";
import { ExerciseNotesModal } from "~/features/exercise/ui/ExerciseNotesModal";
import { type WorkoutExercise } from "~/features/workout/model/types";
import { getEquipmentLabel } from "~/shared/lib/equipment";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "~/shared/ui/Drawer";
import { Button } from "~/shared/ui/Button";
import { XmarkIcon } from "~/shared/ui/icons";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const WorkoutExercises = () => {
  const workout = useWorkout();

  return (
    <div className="mt-10 flex flex-col gap-10 px-4 lg:mt-0 lg:max-w-[460px] lg:flex-1 lg:overflow-y-auto lg:py-7">
      {workout.sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-6">
          <h2 className="text-2xl font-black uppercase">{section.title}</h2>
          <div className="flex flex-col gap-5">
            {section.exercises.map((exercise) => (
              <WorkoutExerciseScreen key={exercise.id} exercise={exercise}>
                <WorkoutExerciseCard exercise={exercise} />
              </WorkoutExerciseScreen>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

const WorkoutExerciseScreen = ({
  exercise,
  children,
}: {
  exercise: WorkoutExercise;
  children?: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger className="outline-none">{children}</DialogTrigger>
        <DialogContent className="h-[85vh] overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Упражнение</DialogTitle>
            <DialogDescription>Просмотр упражнения</DialogDescription>
          </VisuallyHidden.Root>
          <ExerciseProvider exercise={exercise}>
            <ModalContent exercise={exercise} />
          </ExerciseProvider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger className="outline-none">{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Упражнение</DrawerTitle>
          <DrawerDescription>Просмотр упражнения</DrawerDescription>
        </VisuallyHidden.Root>
        <DrawerClose asChild>
          <Button
            variant={"secondary"}
            size={"icon"}
            className="fixed top-5 left-5 z-40"
          >
            <XmarkIcon size={19} />
          </Button>
        </DrawerClose>
        <ExerciseProvider exercise={exercise}>
          <ModalContent exercise={exercise} />
        </ExerciseProvider>
      </DrawerContent>
    </Drawer>
  );
};

const ModalContent = ({ exercise }: { exercise: WorkoutExercise }) => {
  return (
    <div className="bg-background-200 overflow-y-auto pb-4">
      <div className="overflow-x-hidden overflow-y-hidden pb-6">
        <div className="relative flex h-[45vh] w-full items-end justify-center bg-cover bg-center text-center">
          <ExerciseVideo videoSrc={exercise.video} />
          <h1 className="z-10 text-3xl font-black">{exercise.title}</h1>
        </div>
        <div className="px-5">
          <div className="my-3 flex items-center justify-center gap-2.5">
            <ExerciseActionButton
              label={
                getEquipmentLabel(exercise.selectedEquipment) ??
                "Собственный вес"
              }
              className="cursor-default"
              onClick={() => {}}
            />

            <ExerciseNotesModal>
              <ExerciseActionButton label="Заметки" onClick={() => {}} />
            </ExerciseNotesModal>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-5">
        <table className="w-full table-fixed text-left">
          <thead className="text-muted-foreground border-b text-sm [&>tr>td]:py-2 [&>tr>td]:font-medium">
            <tr>
              <td>Сет</td>
              <td>Вес</td>
              <td>
                {exercise.type === ExerciseType.TIMED ? "Время" : "Повторений"}
              </td>
              <td />
            </tr>
          </thead>
          <tbody className="text-lg *:px-5 *:py-2 [&>tr>td]:py-3 [&>tr>td]:font-semibold [&>tr>td>input]:outline-none">
            {exercise.sets.map((set) => (
              <tr key={set.id}>
                <td>{set.id}</td>
                <td>
                  {exercise.selectedEquipment === "body_weight" ? (
                    <span className="text-muted-foreground">--</span>
                  ) : (
                    <>{set.weight} кг</>
                  )}
                </td>
                <td>
                  {exercise.type === ExerciseType.TIMED ? (
                    <>{set.time} сек</>
                  ) : (
                    set.reps
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
