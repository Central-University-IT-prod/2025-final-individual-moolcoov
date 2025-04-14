import { Button } from "~/shared/ui/Button";
import {
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  Drawer,
  DrawerDescription,
  DrawerTitle,
} from "~/shared/ui/Drawer";
import { LottieCoinIcon, XmarkIcon } from "~/shared/ui/icons";
import { useUserStore } from "../model/store";
import NumberFlow from "@number-flow/react";
import type { CSSProperties } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import { getClothes, getClothesTypeLabel } from "../lib/character";
import { motion } from "motion/react";
import React from "react";
import { cn } from "~/shared/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const UserStoreModal = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[85vh] overflow-x-hidden overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Магазин</DialogTitle>
            <DialogDescription>Магазин предметов</DialogDescription>
          </VisuallyHidden.Root>
          <Store />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Магазин</DrawerTitle>
          <DrawerDescription>Магазин предметов</DrawerDescription>
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
        <Store />
      </DrawerContent>
    </Drawer>
  );
};

const Store = () => {
  const { user, updateUser } = useUserStore();
  const clothes = getClothes();
  const [errored, setErrored] = React.useState<string | null>(null);

  const onBuy = React.useCallback(
    (id: string) => {
      if (user) {
        const price = clothes.find((item) => item.id === id)?.price ?? Infinity;

        if (user.coins < price) {
          setErrored(id);
          return;
        }

        updateUser({
          ...user,
          availableClothes: [...user.availableClothes, id],
          coins: user.coins - price,
        });
      }
    },
    [user],
  );

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-5 pb-5">
      <div className="flex flex-col items-center gap-4 py-10">
        <div className="flex items-center gap-3">
          <LottieCoinIcon size={45} />
          <NumberFlow
            className="text-lottie text-4xl font-black"
            value={user.coins ?? 0}
            trend={1}
            style={
              {
                fontVariantNumeric: "tabular-nums",
                "--number-flow-char-height": "0.85em",
              } as CSSProperties
            }
          />
        </div>
        <h2 className="text-lottie text-center text-xl font-black">
          ЛОТТИ-КОИНОВ
        </h2>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold">Магазин</h2>
        <div className="grid grid-cols-2 gap-3">
          {clothes.map((item) => (
            <button
              key={item.id}
              className="border-muted bg-muted relative flex aspect-square flex-col items-start justify-end gap-1 overflow-hidden rounded-2xl border-2 p-4 text-left disabled:cursor-default disabled:opacity-30"
              disabled={user.availableClothes.includes(item.id)}
              onClick={() => onBuy(item.id)}
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
              <p className="text-muted-foreground z-[5] text-xs font-medium">
                {getClothesTypeLabel(item.type)}
              </p>
              <h2 className="z-[5] text-sm font-bold">{item.title}</h2>
              <p className="z-[5] flex items-center gap-2">
                <LottieCoinIcon size={18} />
                <span
                  className={cn("text-lottie text-sm font-bold", {
                    "text-red-500": errored === item.id,
                  })}
                >
                  {item.price}
                </span>
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
