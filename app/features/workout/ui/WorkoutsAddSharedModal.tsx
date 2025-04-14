import { Button } from "~/shared/ui/Button";
import {
  DrawerContent,
  DrawerClose,
  Drawer,
  DrawerDescription,
  DrawerTitle,
} from "~/shared/ui/Drawer";
import { PhotoIcon, XmarkIcon } from "~/shared/ui/icons";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "~/shared/ui/Dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import type { Workout } from "../model/types";
import React from "react";
import { MediaUploader } from "~/features/media/ui/MediaUploader";
import { addMediaToDB } from "~/features/media/model/db";
import { v4 as uuidv4 } from "uuid";
import { addWorkoutToDB } from "../model/db";
import { useNavigate } from "react-router";
import { useWorkoutsStore } from "../model/store";

export const WorkoutAddSharedModal = ({
  workoutData,
}: {
  workoutData: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [workout, setWorkout] = React.useState<Workout>();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        const workout = JSON.parse(decodeURIComponent(workoutData));
        setWorkout(workout);

        if (workout) {
          setOpen(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-[85vh] overflow-x-hidden overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Добавить упражнение</DialogTitle>
            <DialogDescription>Добавить упражнение</DialogDescription>
          </VisuallyHidden.Root>
          <Share workout={workout} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false} open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[85vh] overflow-x-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Добавить упражнение</DrawerTitle>
          <DrawerDescription>Добавить упражнение</DrawerDescription>
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
        <Share workout={workout} />
      </DrawerContent>
    </Drawer>
  );
};

const Share = ({ workout }: { workout?: Workout }) => {
  const [file, setFile] = React.useState<Blob>();
  const navigate = useNavigate();
  const addWorkout = useWorkoutsStore((state) => state.addWorkout);

  if (!workout || !workout.title) {
    return null;
  }

  const onSubmit = React.useCallback(async () => {
    if (!file) {
      return;
    }

    const imageId = uuidv4();

    const image = await addMediaToDB({
      type: "photo",
      data: file,
      id: imageId,
      size: file.size,
    });

    let newWorkout = { ...workout };
    newWorkout.id = uuidv4();
    newWorkout.createdAt = new Date();
    newWorkout.editedAt = undefined;
    newWorkout.saved = false;

    if (image) {
      newWorkout.image = {
        type: "stored",
        storedId: imageId,
      };
    }

    await addWorkout(newWorkout);

    navigate("/workouts");
  }, [file, workout, navigate, addWorkout]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-5 overflow-y-auto px-5 py-5">
      <p className="text-center text-sm font-medium">Добавить упражнение</p>
      <h1 className="font-medium-sans text-center text-2xl">{workout.title}</h1>
      <div className="w-full flex-1">
        <MediaUploader
          icon={<PhotoIcon size={40} />}
          title="Обложка тренировки"
          subtitle="Лучше всего подходят вертикальные фото"
          limitLabel="5 МБ"
          limit={1024 * 1024 * 5}
          type="photo"
          hook={setFile}
          aspectRatio="6/7"
        />
      </div>
      <Button disabled={!file} onClick={onSubmit} className="min-h-12">
        ДОБАВИТЬ
      </Button>
    </div>
  );
};
