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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import { CharacterProfile } from "./UserCharacter";
import { getAvailableClothes, type Clothes } from "../lib/character";
import React from "react";
import { useUserStore } from "../model/store";
import { cn } from "~/shared/lib/utils";
import { motion } from "motion/react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const CharacterModal = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[85vh] overflow-x-hidden overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Персонаж</DialogTitle>
            <DialogDescription>Ваш персонаж</DialogDescription>
          </VisuallyHidden.Root>
          <Character />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Персонаж</DrawerTitle>
          <DrawerDescription>Ваш персонаж</DrawerDescription>
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
        <Character />
      </DrawerContent>
    </Drawer>
  );
};

const Character = () => {
  const { user, updateUser } = useUserStore();
  const clothes = getAvailableClothes(user?.availableClothes);

  const onSelect = React.useCallback(
    (type: string) => {
      return async (id: string) => {
        if (!user) {
          return;
        }

        if (type === "hair") {
          await updateUser({
            ...user,
            character: { ...user.character, hair: id },
          });
          return;
        }

        if (type === "pants") {
          await updateUser({
            ...user,
            character: { ...user.character, pants: id },
          });
          return;
        }

        if (type === "boots") {
          await updateUser({
            ...user,
            character: { ...user.character, boots: id },
          });
          return;
        }

        if (type === "hat") {
          await updateUser({
            ...user,
            character: { ...user.character, hat: id },
          });
          return;
        }

        if (type === "item") {
          await updateUser({
            ...user,
            character: { ...user.character, item: id },
          });
          return;
        }
      };
    },
    [user, updateUser],
  );

  return (
    <div className="flex h-full flex-col items-center gap-7 overflow-y-auto pb-14">
      <CharacterProfile />
      <div className="flex w-full flex-col gap-7 px-5">
        <Section
          title="Шляпа"
          items={clothes.hats}
          active={user?.character.hat}
          onSelect={onSelect("hat")}
        />
        <Section
          title="Волосы"
          items={clothes.hair}
          active={user?.character.hair}
          onSelect={onSelect("hair")}
        />
        <Section
          title="Предмет"
          items={clothes.items}
          active={user?.character.item}
          onSelect={onSelect("item")}
        />
        <Section
          title="Штаны"
          items={clothes.pants}
          active={user?.character.pants}
          onSelect={onSelect("pants")}
        />
        <Section
          title="Ботинки"
          items={clothes.boots}
          active={user?.character.boots}
          onSelect={onSelect("boots")}
        />
      </div>
    </div>
  );
};

const Section = ({
  title,
  items,
  active,
  onSelect,
}: {
  title: string;
  items: Clothes[];
  active?: string;
  onSelect?: (id: string) => void | Promise<void>;
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="text-2xl font-black">{title}</h1>
      <div className="flex flex-wrap gap-3">
        {items.map((item) => {
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              className={cn(
                "border-muted bg-muted relative flex h-[150px] w-[150px] flex-col items-start justify-end gap-1 overflow-hidden rounded-2xl border-2 p-4 text-left",
                {
                  "border-white": isActive,
                },
              )}
              onClick={() => onSelect?.(item.id)}
            >
              {item.preview && (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  className="absolute inset-0 h-full w-full"
                  src={item.preview}
                  alt={item.title}
                />
              )}
              {isActive && (
                <p className="text-muted-foreground z-[5] text-xs font-medium">
                  Экипировано
                </p>
              )}
              <h2 className="z-[5] text-sm font-bold">{item.title}</h2>
            </button>
          );
        })}
      </div>
    </div>
  );
};
