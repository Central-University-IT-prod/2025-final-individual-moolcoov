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
import { useUserStore } from "../model/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/shared/ui/AlertDialog";
import { deleteEverything } from "~/shared/lib/data";
import { useNavigate } from "react-router";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export const UserSettingsModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="h-[85vh] overflow-hidden">
          <VisuallyHidden.Root>
            <DialogTitle>Настройки</DialogTitle>
            <DialogDescription>Настройки профиля</DialogDescription>
          </VisuallyHidden.Root>
          <Settings />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Настройки</DrawerTitle>
          <DrawerDescription>Настройки профиля</DrawerDescription>
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
        <Settings />
      </DrawerContent>
    </Drawer>
  );
};

const Settings = () => {
  const { user, updateUser } = useUserStore();
  const navigate = useNavigate();

  const [name, setName] = React.useState(user?.name);
  const [height, setHeight] = React.useState(user?.height.value);
  const [weight, setWeight] = React.useState(user?.weight.value);

  React.useEffect(() => {
    const interval = setTimeout(() => {
      if (user) {
        const newName = name ?? user.name;
        const newHeight = height ?? user.height.value;
        const newWeight = weight ?? user.weight.value;

        updateUser({
          ...user,
          name: newName,
          height: { value: newHeight, date: new Date() },
          weight: { value: newWeight, date: new Date() },
        });
      }
    }, 1000);

    return () => clearTimeout(interval);
  }, [name, height, weight, user, updateUser]);

  return (
    <div className="flex h-full flex-col gap-7 px-5 pt-20 pb-(--bottom-button) lg:py-9">
      <h1 className="text-3xl font-black">Настройки</h1>
      {user && (
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-medium">
              Имя
            </label>
            <input
              name="name"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите свое имя"
              className="bg-muted w-full rounded-2xl border px-4 py-3 font-medium outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="height" className="font-medium">
              Рост
            </label>
            <input
              name="height"
              id="height"
              type="number"
              placeholder="Введите ваш рост"
              value={height}
              onChange={(e) =>
                setHeight(
                  e.target.valueAsNumber <= 250 || e.target.value === ""
                    ? e.target.valueAsNumber
                    : height,
                )
              }
              className="bg-muted w-full rounded-2xl border px-4 py-3 font-medium outline-none"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="weight" className="font-medium">
              Вес
            </label>
            <input
              name="weight"
              id="weight"
              type="number"
              placeholder="Введите ваш вес"
              value={weight}
              onChange={(e) =>
                setWeight(
                  e.target.valueAsNumber <= 200 || e.target.value === ""
                    ? e.target.valueAsNumber
                    : weight,
                )
              }
              className="bg-muted w-full rounded-2xl border px-4 py-3 font-medium outline-none"
            />
          </div>
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="px-4 py-4 font-medium text-red-500 transition-transform active:scale-[0.95]">
            Удалить все данные
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить все данные?</AlertDialogTitle>
            <AlertDialogDescription>
              Это необратимое действие
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500/20 text-red-500"
              onClick={async () => {
                await deleteEverything();
                navigate("/onboarding");
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
