import React from "react";
import { cn } from "~/shared/lib/utils";
import { Button } from "~/shared/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "~/shared/ui/Drawer";
import {
  CameraIcon,
  ClockColoredIcon,
  DumbBellColoredIcon,
  PhotoIcon,
  PlusIcon,
  XmarkIcon,
} from "~/shared/ui/icons";
import { ExerciseType, type Exercise } from "../model/types";
import { MediaUploader } from "~/features/media/ui/MediaUploader";
import { Checkbox } from "~/shared/ui/Checkbox";
import { ControlButtons } from "~/shared/ui/ControlButtons";
import { CreateModal, type CreateScreen } from "~/shared/ui/CreateModal";
import { useExercisesStore } from "../model/store";
import { v4 as uuidv4 } from "uuid";
import { Difficulty } from "~/shared/types/difficulty";
import { addMediaToDB } from "~/features/media/model/db";
import { getDifficultyIcon, getDifficultyLabel } from "~/shared/lib/difficulty";
import { getEquipment, type EquipmentType } from "~/shared/lib/equipment";
import type { Tag } from "~/features/tag/model/types";
import { useTagsStore } from "~/features/tag/model/store";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface CreateExerciseObject {
  title?: string;
  type?: ExerciseType;
  difficulty?: Difficulty;
  equipment?: EquipmentType[];
  selectedTags?: Tag[];

  image?: Blob;
  video?: Blob;
}

interface CreateExerciseContextType {
  exerciseObject: CreateExerciseObject;
  setExerciseObject: React.Dispatch<React.SetStateAction<CreateExerciseObject>>;
}

const CreateExerciseContext = React.createContext<
  CreateExerciseContextType | undefined
>(undefined);

export const ExerciseCreateModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="px-none py-none h-full max-h-[750px] overflow-x-hidden overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Создать упражнение</DialogTitle>
            <DialogDescription>Создание упражнения</DialogDescription>
          </VisuallyHidden.Root>
          <CreateExercise setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Создать упражнение</DrawerTitle>
          <DrawerDescription>Создание упражнения</DrawerDescription>
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
        <CreateExercise setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  );
};

const CreateExercise = ({ setOpen }: { setOpen: React.Dispatch<boolean> }) => {
  const addExercise = useExercisesStore((state) => state.addExercise);
  const [exerciseObject, setExerciseObject] =
    React.useState<CreateExerciseObject>({});

  const finish = React.useCallback(async () => {
    const exercise: Exercise = {
      id: uuidv4(),
      title: exerciseObject.title || "Без названия",
      type: exerciseObject.type || ExerciseType.QUANTITY,
      difficulty: exerciseObject.difficulty || Difficulty.MEDIUM,
      equipment: exerciseObject.equipment || ["body_weight"],
      createdAt: new Date(),
      editedAt: new Date(),
      tags: exerciseObject.selectedTags,
    };

    if (exerciseObject.image) {
      const id = uuidv4();

      await addMediaToDB({
        type: "photo",
        data: exerciseObject.image,
        id: id,
        size: exerciseObject.image.size,
      });

      exercise.image = {
        type: "stored",
        storedId: id,
      };
    }

    if (exerciseObject.video) {
      const id = uuidv4();

      await addMediaToDB({
        type: "video",
        data: exerciseObject.video,
        id: id,
        size: exerciseObject.video.size,
      });

      exercise.video = {
        type: "stored",
        storedId: id,
      };
    }

    await addExercise(exercise);
    setExerciseObject({});
    setOpen(false);
  }, [exerciseObject, addExercise]);

  return (
    <CreateExerciseContext.Provider
      value={{
        exerciseObject,
        setExerciseObject,
      }}
    >
      <CreateModal
        screens={[
          TitleScreen,
          PhotoScreen,
          VideoScreen,
          DifficultyScreen,
          EquipmentScreen,
          TagsScreen,
        ]}
        onFinish={finish}
      />
    </CreateExerciseContext.Provider>
  );
};

const useCreateExercise = () => {
  const context = React.useContext(CreateExerciseContext);
  if (context === undefined) {
    throw new Error(
      "useCreateExercise must be used within a CreateExerciseProvider",
    );
  }
  return context;
};

const TitleScreen: CreateScreen = ({ next, prev }) => {
  const { setExerciseObject } = useCreateExercise();
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState<ExerciseType | undefined>();

  const onInput = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value.replace("\n", ""));
    },
    [setTitle],
  );

  const onSubmit = React.useCallback(async () => {
    setExerciseObject((prev) => ({ ...prev, title, type }));
    await next();
  }, [next, title, type]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col items-center overflow-y-auto">
        <div className="flex w-full flex-1 justify-center">
          <textarea
            className="w-full content-center py-16 text-center text-3xl font-black text-balance outline-none"
            placeholder="ВВЕДИТЕ НАЗВАНИЕ УПРАЖНЕНИЯ"
            onChange={onInput}
            value={title}
          />
        </div>
        <div className="flex w-full gap-4">
          <TypeButton
            icon={<DumbBellColoredIcon size={34} />}
            label="На количество"
            onClick={() => {
              setType(ExerciseType.QUANTITY);
            }}
            active={type === ExerciseType.QUANTITY}
          />
          <TypeButton
            icon={
              <div className="p-0.5">
                <ClockColoredIcon size={30} />
              </div>
            }
            label="На время"
            onClick={() => {
              setType(ExerciseType.TIMED);
            }}
            active={type === ExerciseType.TIMED}
          />
        </div>
      </div>
      <ControlButtons
        onNext={onSubmit}
        label="ДАЛЕЕ"
        disabled={title === "" || !type}
      />
    </div>
  );
};

const PhotoScreen: CreateScreen = ({ next, prev }) => {
  const { setExerciseObject } = useCreateExercise();
  const [file, setFile] = React.useState<Blob>();

  const onSubmit = React.useCallback(async () => {
    setExerciseObject((prev) => ({ ...prev, image: file }));
    await next();
  }, [file, next]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-20 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col items-start gap-8 overflow-y-auto">
        <h1 className="text-3xl font-black">ДОБАВЬТЕ ФОТО</h1>
        <MediaUploader
          icon={<PhotoIcon size={40} />}
          title="Фото упражнения"
          subtitle="Лучше всего подходят квадратные фото"
          limitLabel="5 МБ"
          limit={1024 * 1024 * 5}
          type="photo"
          hook={setFile}
        />
      </div>
      <ControlButtons onNext={onSubmit} label="ДАЛЕЕ" disabled={!file} />
    </div>
  );
};

const VideoScreen: CreateScreen = ({ next, prev }) => {
  const { setExerciseObject } = useCreateExercise();
  const [file, setFile] = React.useState<Blob>();

  const onSubmit = React.useCallback(async () => {
    setExerciseObject((prev) => ({ ...prev, video: file }));
    await next();
  }, [file, next]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-20 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col items-start gap-8 overflow-y-auto">
        <h1 className="text-3xl font-black">ДОБАВЬТЕ ВИДЕО</h1>
        <MediaUploader
          icon={<CameraIcon size={40} />}
          title="Видео с упражнением"
          subtitle="Лучше всего подходят вертикальные клипы до 5 секунд"
          limitLabel="20 МБ"
          limit={1024 * 1024 * 100020}
          type="video"
          aspectRatio="6/7"
          hook={setFile}
        />
      </div>

      <ControlButtons onNext={onSubmit} label="ДАЛЕЕ" disabled={!file} />
    </div>
  );
};

const DifficultyScreen: CreateScreen = ({ next, prev }) => {
  const { setExerciseObject } = useCreateExercise();
  const [difficulty, setDifficulty] = React.useState<Difficulty>();

  const onSubmit = React.useCallback(async () => {
    setExerciseObject((prev) => ({ ...prev, difficulty }));
    await next();
  }, [difficulty, next]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto pt-20 lg:pt-0">
        <h1 className="text-3xl font-black text-balance">УКАЖИТЕ СЛОЖНОСТЬ</h1>

        <div className="flex flex-col gap-1.5">
          {Object.values(Difficulty).map((d) => {
            const Icon = getDifficultyIcon(d);

            return (
              <Checkbox
                icon={<Icon size={18} />}
                key={d}
                label={getDifficultyLabel(d)}
                checked={difficulty === d}
                onChange={() => setDifficulty(d)}
              />
            );
          })}
        </div>
      </div>
      <ControlButtons onNext={onSubmit} label="ДАЛЕЕ" disabled={!difficulty} />
    </div>
  );
};

const EquipmentScreen: CreateScreen = ({ next, prev }) => {
  const equipment = getEquipment();
  const { setExerciseObject } = useCreateExercise();
  const [activeEquipment, setEquipment] = React.useState<EquipmentType[]>([
    "body_weight",
  ]);

  const addEquipment = React.useCallback((equipmentType: EquipmentType) => {
    return () => {
      setEquipment((prev) => [...prev, equipmentType]);
    };
  }, []);

  const removeEquipment = React.useCallback((equipmentType: EquipmentType) => {
    return () => {
      setEquipment((prev) => prev.filter((e) => e !== equipmentType));
    };
  }, []);

  const onSubmit = React.useCallback(async () => {
    setExerciseObject((prev) => ({ ...prev, equipment: activeEquipment }));
    await next();
  }, [activeEquipment, next]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto pt-20 lg:pt-0">
        <h1 className="text-3xl font-black text-balance">
          ВЫБЕРИТЕ ОБОРУДОВАНИЕ
        </h1>

        <div className="flex flex-col gap-1.5">
          {equipment.map((e) => {
            const active = activeEquipment?.includes(e.type);

            return (
              <Checkbox
                key={e.type}
                label={e.name}
                checked={active}
                onChange={
                  active ? removeEquipment(e.type) : addEquipment(e.type)
                }
              />
            );
          })}
        </div>
      </div>
      <ControlButtons
        onNext={onSubmit}
        label="ДАЛЕЕ"
        disabled={!(activeEquipment.length > 0)}
      />
    </div>
  );
};

const TagsScreen: CreateScreen = ({ next, prev }) => {
  const { tags, addTag } = useTagsStore();

  const [isAdding, setIsAdding] = React.useState(false);
  const [newTagName, setNewTagName] = React.useState("");

  const { setExerciseObject } = useCreateExercise();
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const addSelectedTag = React.useCallback(
    (tag: Tag) => {
      return () => {
        setSelectedTags((prev) => {
          return [...prev, tag];
        });
      };
    },
    [setSelectedTags],
  );

  const removeSelectedTag = React.useCallback(
    (tag: Tag) => {
      return () => {
        setSelectedTags((prev) => prev.filter((t) => t.id !== tag.id));
      };
    },
    [setSelectedTags],
  );

  React.useEffect(() => {
    setExerciseObject((prev) => ({ ...prev, selectedTags }));
  }, [selectedTags]);

  const onSubmit = React.useCallback(async () => {
    setExerciseObject((prev) => ({ ...prev, selectedTags }));
    await next();
  }, [selectedTags, next, setExerciseObject]);

  const onTagCreate = React.useCallback(async () => {
    if (newTagName.trim() === "") {
      setIsAdding(false);
      setNewTagName("");
      return;
    }
    await addTag({ id: uuidv4(), label: newTagName });
    setIsAdding(false);
    setNewTagName("");
  }, [newTagName, addTag]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col gap-8 overflow-x-hidden overflow-y-auto pt-20 lg:pt-0">
        <h1 className="text-3xl font-black text-balance">ДОБАВЬТЕ ТЕГИ</h1>

        <div className="flex flex-wrap gap-3">
          {tags.map((t) => {
            const active = selectedTags?.includes(t);

            return (
              <button
                key={t.id}
                className={cn(
                  "bg-muted h-11 rounded-xl px-[18px] py-3 text-sm font-medium",
                  {
                    "bg-accent text-background-200": active,
                  },
                )}
                onClick={active ? removeSelectedTag(t) : addSelectedTag(t)}
              >
                {t.label}
              </button>
            );
          })}
          <button
            className={cn(
              "bg-muted h-11 rounded-xl px-4 py-3 text-sm font-medium",
              {
                "px-0 py-0": isAdding,
              },
            )}
            onClick={() => setIsAdding(true)}
          >
            {isAdding ? (
              <input
                placeholder="Новый тег"
                value={newTagName}
                onBlur={onTagCreate}
                onChange={(e) => setNewTagName(e.target.value)}
                className="resize-none px-5 py-2 text-base outline-none"
              />
            ) : (
              <PlusIcon size={14} />
            )}
          </button>
        </div>
      </div>
      <ControlButtons onNext={onSubmit} label="СОХРАНИТЬ" />
    </div>
  );
};

const TypeButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={cn(
        "bg-muted text-muted-foreground flex flex-1 flex-col gap-2 rounded-2xl px-3.5 py-3 transition-transform active:scale-[0.95]",
        {
          "text-background-200 bg-white": active,
        },
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-left font-medium">{label}</span>
    </button>
  );
};
