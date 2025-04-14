import { Button } from "~/shared/ui/Button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  Drawer,
  DrawerDescription,
  DrawerTitle,
} from "~/shared/ui/Drawer";
import { DumbBellColoredIcon, XmarkIcon } from "~/shared/ui/icons";
import { useUserStore } from "../model/store";
import { getXPLevel, LEVEL_TO_XP } from "../lib/xp";
import NumberFlow from "@number-flow/react";
import type { CSSProperties } from "react";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const UserLevelModal = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[85vh] overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Уровень</DialogTitle>
            <DialogDescription>Ваш уровень</DialogDescription>
          </VisuallyHidden.Root>
          <Level />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Уровень</DrawerTitle>
          <DrawerDescription>Ваш уровень</DrawerDescription>
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
        <Level />
      </DrawerContent>
    </Drawer>
  );
};

const Level = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null;
  }

  const level = getXPLevel(user.xp);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-12 px-5 pb-14">
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
        <h2 className="text-xp text-center text-3xl font-black">УРОВЕНЬ</h2>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        <div className="bg-muted h-[30px] w-full rounded-full">
          <div
            style={{
              width: `max(10%, ${((user.xp % LEVEL_TO_XP) / LEVEL_TO_XP) * 100}%`,
            }}
            className="bg-xp h-full w-[10%] rounded-full"
          ></div>
        </div>
        <p className="text-muted-foreground font-medium">
          До следующего уровня: {LEVEL_TO_XP - (user.xp % LEVEL_TO_XP)} XP
        </p>
      </div>
    </div>
  );
};
