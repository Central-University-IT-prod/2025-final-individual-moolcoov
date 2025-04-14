import { Button } from "~/shared/ui/Button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  Drawer,
  DrawerDescription,
  DrawerTitle,
} from "~/shared/ui/Drawer";
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
import type { Workout } from "../model/types";
import React from "react";

export const WorkoutShareModal = ({
  workout,
  children,
}: {
  workout: Workout;
  children: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[85vh] overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Поделится упражнением</DialogTitle>
            <DialogDescription>Поделится упражнением</DialogDescription>
          </VisuallyHidden.Root>
          <Share workout={workout} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Поделится упражнением</DrawerTitle>
          <DrawerDescription>Поделится упражнением</DrawerDescription>
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

const Share = ({ workout }: { workout: Workout }) => {
  const [url, setUrl] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setUrl(
      `${window.location.origin}/workouts?data=${encodeURIComponent(JSON.stringify(workout))}`,
    );
  }, [workout]);

  const onShare = React.useCallback(async () => {
    try {
      await navigator.share({
        title: workout.title,
        text: "Занимайся в Block со мной",
        url: url,
      });
    } catch (err) {
      console.error(err);
    }
  }, [workout, url]);

  const onCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (err) {
      console.error(err);
    }
  }, [url, setCopied]);

  return (
    <div className="flex h-full w-full flex-col items-center px-5 py-5">
      <p className="text-center text-sm font-medium">Поделится тренировкой</p>
      <div className="flex flex-1 items-center justify-center">
        <h1 className="font-medium-sans text-center text-2xl">
          {workout.title}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-4">
        <Button onClick={onShare}>Поделится</Button>
        <Button variant={"secondary"} onClick={onCopy}>
          {copied ? "Скопировано" : "Скопировать ссылку"}
        </Button>
      </div>
    </div>
  );
};
