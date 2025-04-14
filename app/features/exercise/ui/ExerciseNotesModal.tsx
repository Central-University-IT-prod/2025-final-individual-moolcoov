import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "~/shared/ui/Drawer";
import React from "react";
import { useExercise } from "../model/ExerciseProvider";
import { useExercisesStore } from "../model/store";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ExerciseNotesModalProps {
  children: React.ReactNode;
}

export const ExerciseNotesModal = ({ children }: ExerciseNotesModalProps) => {
  const [exercise, setExercise] = useExercise();
  const { updateExercise } = useExercisesStore();

  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState(exercise.notes || "");

  const onSave = React.useCallback(async () => {
    updateExercise({ ...exercise, notes });
    setExercise({ ...exercise, notes });
    setOpen(false);
  }, [notes]);

  return (
    <Drawer shouldScaleBackground={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="m-auto h-[84vh] overflow-hidden lg:max-w-lg">
        <VisuallyHidden.Root>
          <DrawerTitle>Заметки</DrawerTitle>
          <DrawerDescription>Заметки упражнения</DrawerDescription>
        </VisuallyHidden.Root>
        <DrawerHandle />
        <button
          className="absolute top-2 right-0 px-5 py-3.5 transition-colors active:opacity-70"
          onClick={onSave}
        >
          Сохранить
        </button>
        <div className="h-full px-5 pt-15 pb-5">
          <h1 className="text-2xl font-black">{exercise.title}</h1>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Запишите свои мысли здесь..."
            className="mt-4 h-full w-full resize-none font-medium outline-none"
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
