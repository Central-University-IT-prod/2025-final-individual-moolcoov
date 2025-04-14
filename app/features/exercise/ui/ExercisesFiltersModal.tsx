import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/shared/ui/Drawer";
import { useExercisesFilters } from "../model/ExercisesProvider";
import { cn } from "~/shared/lib/utils";
import React, { type JSX } from "react";
import { getDifficultyIcon, getDifficultyLabel } from "~/shared/lib/difficulty";
import { CheckIcon, XmarkIcon } from "~/shared/ui/icons";
import { Button } from "~/shared/ui/Button";
import { Difficulty } from "~/shared/types/difficulty";
import type { UUID } from "~/shared/types/uuid";
import { Checkbox } from "~/shared/ui/Checkbox";
import { getEquipment } from "~/shared/lib/equipment";
import { useTagsStore } from "~/features/tag/model/store";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
export const ExercisesFiltersModal = ({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) => {
  const [open, setOpen] = React.useState(false);
  const [, setFilters, currentFilters] = useExercisesFilters();

  return (
    <Drawer shouldScaleBackground={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild={asChild}>{children}</DrawerTrigger>
      <DrawerContent className="m-auto max-h-[85vh] lg:max-w-lg">
        <VisuallyHidden.Root>
          <DrawerDescription>Фильтры упражнений</DrawerDescription>
        </VisuallyHidden.Root>
        <DrawerClose asChild>
          <Button
            variant={"secondary"}
            size={"icon"}
            className="fixed top-5 left-5 z-30"
          >
            <XmarkIcon size={19} />
          </Button>
        </DrawerClose>
        <DrawerHeader>
          <DrawerTitle>ФИЛЬТРЫ</DrawerTitle>
        </DrawerHeader>
        {currentFilters > 0 && (
          <button
            className="bg-muted fixed top-5 right-5 z-30 flex h-[35px] items-center gap-1.5 rounded-full px-3 text-xs font-medium"
            onClick={() => {
              setFilters({});
              setOpen(false);
            }}
          >
            Сбросить
          </button>
        )}
        <ExercisesFilters />
      </DrawerContent>
    </Drawer>
  );
};

const ExercisesFilters = () => {
  return (
    <div className="flex flex-col gap-8 overflow-y-auto px-5 pt-[18px] pb-[80px]">
      <ExercisesFiltersTags />
      <ExercisesFiltersDifficulty />
      <ExercisesEquipment />
      <div className="fixed bottom-0 left-0 w-full px-5 pb-(--bottom-button)">
        <DrawerClose asChild>
          <Button>СОХРАНИТЬ</Button>
        </DrawerClose>
      </div>
    </div>
  );
};

const ExercisesFiltersTags = () => {
  const tags = useTagsStore((state) => state.tags);

  const [filters, setFilters] = useExercisesFilters();

  if (!tags || tags.length === 0) {
    return null;
  }

  const addTag = React.useCallback((id: UUID) => {
    return () => {
      setFilters((prev) => {
        return { ...prev, tags: [...(prev.tags || []), id] };
      });
    };
  }, []);

  const removeTag = React.useCallback((id: UUID) => {
    return () => {
      setFilters((prev) => {
        return { ...prev, tags: prev.tags?.filter((tag) => tag !== id) };
      });
    };
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-black">ТЕГИ</h2>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => {
          const active = filters.tags?.includes(tag.id);

          return (
            <button
              key={tag.id}
              className={cn(
                "bg-muted rounded-xl px-[18px] py-3 text-sm font-medium",
                {
                  "bg-accent text-background-200": active,
                },
              )}
              onClick={active ? removeTag(tag.id) : addTag(tag.id)}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};

const ExercisesFiltersDifficulty = () => {
  const [filters, setFilters] = useExercisesFilters();

  const addDifficulty = React.useCallback((difficulty: Difficulty) => {
    return () => {
      setFilters((prev) => {
        return {
          ...prev,
          difficulty: [...(prev.difficulty || []), difficulty],
        };
      });
    };
  }, []);

  const removeDifficulty = React.useCallback((difficulty: Difficulty) => {
    return () => {
      setFilters((prev) => {
        return {
          ...prev,
          difficulty: prev.difficulty?.filter((d) => d !== difficulty),
        };
      });
    };
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-black">СЛОЖНОСТЬ</h2>
      <div>
        {Object.values(Difficulty).map((difficulty) => {
          const active = filters.difficulty?.includes(difficulty);
          const Icon = getDifficultyIcon(difficulty);

          return (
            <Checkbox
              key={difficulty}
              icon={<Icon size={18} />}
              label={getDifficultyLabel(difficulty)}
              checked={active}
              onChange={
                active
                  ? removeDifficulty(difficulty)
                  : addDifficulty(difficulty)
              }
            />
          );
        })}
      </div>
    </section>
  );
};

const ExercisesEquipment = () => {
  const equipment = getEquipment();
  const [filters, setFilters] = useExercisesFilters();

  const addEquipment = React.useCallback((equipment: UUID) => {
    return () => {
      setFilters((prev) => {
        return { ...prev, equipment: [...(prev.equipment || []), equipment] };
      });
    };
  }, []);

  const removeEquipment = React.useCallback((equipment: UUID) => {
    return () => {
      setFilters((prev) => {
        return {
          ...prev,
          equipment: prev.equipment?.filter((e) => e !== equipment),
        };
      });
    };
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-black">ОБОРУДОВАНИЕ</h2>
      <div className="flex flex-col gap-1.5">
        {equipment.map((equipment) => {
          const active = filters.equipment?.includes(equipment.type);
          return (
            <Checkbox
              key={equipment.type}
              label={equipment.name}
              checked={active}
              onChange={
                active
                  ? removeEquipment(equipment.type)
                  : addEquipment(equipment.type)
              }
            />
          );
        })}
      </div>
    </section>
  );
};
