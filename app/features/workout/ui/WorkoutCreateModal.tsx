import React from "react";
import { cn } from "~/shared/lib/utils";
import { Button } from "~/shared/ui/Button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerTitle,
  DrawerTrigger,
} from "~/shared/ui/Drawer";
import {
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  XmarkIcon,
} from "~/shared/ui/icons";
import { MediaUploader } from "~/features/media/ui/MediaUploader";
import { Checkbox } from "~/shared/ui/Checkbox";
import type { UUID } from "~/shared/types/uuid";
import { ControlButtons } from "~/shared/ui/ControlButtons";
import { CreateModal, type CreateScreen } from "~/shared/ui/CreateModal";
import { Difficulty } from "~/shared/types/difficulty";
import { getDifficultyIcon, getDifficultyLabel } from "~/shared/lib/difficulty";
import getDefaultWeight, {
  getEquipmentLabel,
  isWeightEquipment,
  type EquipmentType,
} from "~/shared/lib/equipment";
import type {
  Workout,
  WorkoutExercise,
  WorkoutExerciseSet,
  WorkoutSection,
} from "../model/types";
import { MoreIcon } from "~/shared/ui/icons/More";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/shared/ui/DropdownMenu";
import {
  ExercisesProvider,
  useExercises,
  useExercisesFilters,
  useExercisesSearchQuery,
} from "~/features/exercise/model/ExercisesProvider";
import { useExercisesStore } from "~/features/exercise/model/store";
import { ExerciseCard } from "~/features/exercise/ui/ExerciseCard";
import { ExercisesFiltersModal } from "~/features/exercise/ui/ExercisesFiltersModal";
import { FiltersButton } from "~/shared/ui/FiltersButton";
import { HeaderSearch } from "~/shared/ui/HeaderSearch";
import { AnimatePresence } from "motion/react";
import { ExerciseProvider } from "~/features/exercise/model/ExerciseProvider";
import {
  ExerciseActionButton,
  ExerciseVideo,
} from "~/features/exercise/ui/ExerciseModal";
import { ExerciseNotesModal } from "~/features/exercise/ui/ExerciseNotesModal";
import { useDatabase } from "~/shared/lib/indexedDB";
import { ExerciseType, type Exercise } from "~/features/exercise/model/types";
import { getExerciseFromDB } from "~/features/exercise/model/db";
import { Loading } from "~/shared/ui/Loading";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "~/shared/ui/Select";
import {
  calculateUserReps,
  calculateUserTime,
  isExerciseSafeForUser,
} from "../lib/load";
import { WorkoutExerciseCard } from "./WorkoutExerciseCard";
import { v4 as uuidv4 } from "uuid";
import { calculateWorkoutTime } from "../lib/time";
import { addMediaToDB } from "~/features/media/model/db";
import { useWorkoutsStore } from "../model/store";
import { getEquipmentFromExercises } from "../lib/equipment";
import { useTagsStore } from "~/features/tag/model/store";
import type { Tag } from "~/features/tag/model/types";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/Dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface CreateWorkoutObject {
  title?: string;
  difficulty?: Difficulty;
  tags?: Tag[];

  image?: Blob;

  sections?: WorkoutSection[];
}

interface CreateWorkoutContextType {
  workoutObject: CreateWorkoutObject;
  setWorkoutObject: React.Dispatch<React.SetStateAction<CreateWorkoutObject>>;
}

const CreateWorkoutContext = React.createContext<
  CreateWorkoutContextType | undefined
>(undefined);

export const WorkoutCreateModal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);
  const addWorkout = useWorkoutsStore((state) => state.addWorkout);
  const [workoutObject, setWorkoutObject] = React.useState<CreateWorkoutObject>(
    {},
  );

  const finish = React.useCallback(async () => {
    const workout: Workout = {
      id: uuidv4(),
      title: workoutObject.title || "Без названия",
      workoutTime: calculateWorkoutTime(workoutObject.sections),
      difficulty: workoutObject.difficulty || Difficulty.MEDIUM,
      sections: workoutObject.sections || [],
      equipment: getEquipmentFromExercises(workoutObject.sections),
      createdAt: new Date(),
      editedAt: new Date(),
      tags: workoutObject.tags,
    };

    if (workoutObject.image) {
      const id = uuidv4();

      await addMediaToDB({
        type: "photo",
        data: workoutObject.image,
        id: id,
        size: workoutObject.image.size,
      });

      workout.image = {
        type: "stored",
        storedId: id,
      };
    }

    await addWorkout(workout);
    setWorkoutObject({});
    setOpen(false);
  }, [workoutObject]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="px-none py-none h-full max-h-[750px] overflow-x-hidden overflow-y-auto">
          <VisuallyHidden.Root>
            <DialogTitle>Создание тренировки</DialogTitle>
            <DialogDescription>Создание тренировки</DialogDescription>
          </VisuallyHidden.Root>
          <CreateWorkoutContext.Provider
            value={{
              workoutObject,
              setWorkoutObject,
            }}
          >
            <CreateModal
              screens={[
                TitleScreen,
                PhotoScreen,
                DifficultyScreen,
                ExercisesScreen,
                TagsScreen,
              ]}
              onFinish={finish}
            />
          </CreateWorkoutContext.Provider>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="h-[85vh] overflow-hidden">
        <VisuallyHidden.Root>
          <DrawerTitle>Создание тренировки</DrawerTitle>
          <DrawerDescription>Создание тренировки</DrawerDescription>
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
        <CreateWorkoutContext.Provider
          value={{
            workoutObject,
            setWorkoutObject,
          }}
        >
          <CreateModal
            screens={[
              TitleScreen,
              PhotoScreen,
              DifficultyScreen,
              ExercisesScreen,
              TagsScreen,
            ]}
            onFinish={finish}
          />
        </CreateWorkoutContext.Provider>
      </DrawerContent>
    </Drawer>
  );
};

const useCreateWorkout = () => {
  const context = React.useContext(CreateWorkoutContext);
  if (context === undefined) {
    throw new Error(
      "useCreateWorkout must be used within a CreateWorkoutProvider",
    );
  }
  return context;
};

const TitleScreen: CreateScreen = ({ next, prev }) => {
  const { setWorkoutObject } = useCreateWorkout();
  const [title, setTitle] = React.useState("");

  const onInput = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTitle(e.target.value.replace("\n", ""));
    },
    [setTitle],
  );

  const onSubmit = React.useCallback(async () => {
    setWorkoutObject((prev) => ({ ...prev, title }));
    await next();
  }, [next, title]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col items-center overflow-y-auto">
        <div className="flex w-full flex-1 justify-center">
          <textarea
            className="font-medium-sans w-full content-center py-16 text-center text-2xl font-black text-balance outline-none"
            placeholder="ВВЕДИТЕ НАЗВАНИЕ ТРЕНИРОВКИ"
            onChange={onInput}
            value={title}
          />
        </div>
      </div>
      <ControlButtons onNext={onSubmit} label="ДАЛЕЕ" disabled={title === ""} />
    </div>
  );
};

const PhotoScreen: CreateScreen = ({ next, prev }) => {
  const { setWorkoutObject } = useCreateWorkout();
  const [file, setFile] = React.useState<Blob>();

  const onSubmit = React.useCallback(async () => {
    setWorkoutObject((prev) => ({ ...prev, image: file }));
    await next();
  }, [file, next]);

  return (
    <div className="flex h-full flex-col gap-4 px-5 pt-20 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="flex flex-1 flex-col items-start gap-8 overflow-y-auto">
        <h1 className="text-3xl font-black">ДОБАВЬТЕ ФОТО</h1>
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
      <ControlButtons onNext={onSubmit} label="ДАЛЕЕ" disabled={!file} />
    </div>
  );
};

const DifficultyScreen: CreateScreen = ({ next, prev }) => {
  const { setWorkoutObject } = useCreateWorkout();
  const [difficulty, setDifficulty] = React.useState<Difficulty>();

  const onSubmit = React.useCallback(async () => {
    setWorkoutObject((prev) => ({ ...prev, difficulty }));
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

const ExercisesScreen: CreateScreen = ({ next, prev }) => {
  const { setWorkoutObject } = useCreateWorkout();
  const [sections, setSections] = React.useState<WorkoutSection[]>([
    {
      id: 1,
      title: "РАЗМИНКА",
      exercises: [],
    },
  ]);

  const updateSectionTitle = React.useCallback(
    (sectionId: number, title: string) => {
      setSections((prev) => {
        return prev.map((section) => {
          if (section.id === sectionId) {
            return { ...section, title };
          }
          return section;
        });
      });
    },
    [setSections],
  );

  const addSection = React.useCallback(() => {
    setSections((prev) => [
      ...prev,
      { id: prev.length + 1, title: "", exercises: [] },
    ]);
  }, [setSections]);

  const duplicateSection = React.useCallback(
    (sectionId: number) => {
      setSections((prev) => {
        return [
          ...prev,
          {
            id: prev.length + 1,
            title:
              prev.find((section) => section.id === sectionId)?.title ?? "",
            exercises:
              prev.find((section) => section.id === sectionId)?.exercises ?? [],
          },
        ];
      });
    },
    [setSections],
  );

  const deleteSection = React.useCallback(
    (sectionId: number) => {
      setSections((prev) => {
        return prev.filter((section) => section.id !== sectionId);
      });
    },
    [setSections],
  );

  const addExercise = React.useCallback(
    (sectionId: number) => {
      return (exercise: WorkoutExercise) => {
        setSections((prev) => {
          return prev.map((s) => {
            if (s.id === sectionId) {
              return { ...s, exercises: [...s.exercises, exercise] };
            }
            return s;
          });
        });
      };
    },
    [setSections],
  );

  const deleteExercise = React.useCallback(
    (sectionId: number, exerciseId: UUID) => {
      setSections((prev) => {
        return prev.map((s) => {
          if (s.id === sectionId) {
            return {
              ...s,
              exercises: s.exercises.filter((e) => e.id !== exerciseId),
            };
          }
          return s;
        });
      });
    },
    [setSections],
  );

  const onSubmit = React.useCallback(async () => {
    setWorkoutObject((prev) => ({ ...prev, sections }));
    await next();
  }, [sections, next]);

  return (
    <div className="flex h-full flex-col items-center gap-4 pb-(--bottom-button) lg:gap-6 lg:px-7 lg:pt-10 lg:pb-7">
      <div className="mb-16 flex w-full flex-1 flex-col gap-10 overflow-x-hidden overflow-y-auto px-5 pt-20 lg:px-0 lg:pt-0">
        {sections.map((section) => (
          <div className="flex flex-col items-center gap-5">
            <div className="flex w-full items-center gap-2">
              <input
                key={section.id}
                className="w-full text-2xl font-black uppercase outline-none"
                placeholder="НАЗВАНИЕ БЛОКА"
                value={section.title}
                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    className="min-w-9"
                  >
                    <MoreIcon size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => duplicateSection(section.id)}
                  >
                    Дублировать
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500"
                    onClick={() => deleteSection(section.id)}
                  >
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {section.exercises.length > 0 && (
              <div className="flex w-full flex-col gap-4">
                {section.exercises.map((exercise) => (
                  <div className="flex items-center gap-3">
                    <WorkoutExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-muted-foreground flex h-8 w-8 items-center justify-center">
                          <MoreIcon size={12} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() =>
                            deleteExercise(section.id, exercise.id)
                          }
                        >
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
            <AddExerciseModal onAdd={addExercise(section.id)}>
              <button className="bg-muted flex h-10 w-fit items-center justify-center gap-2.5 rounded-full px-4 transition-transform active:scale-[0.92]">
                <PlusIcon size={14} />
                <span className="text-xs font-medium">Добавить упражнение</span>
              </button>
            </AddExerciseModal>
          </div>
        ))}
      </div>
      <button
        className="bg-muted absolute bottom-25 flex h-10 w-fit items-center justify-center gap-2.5 rounded-full px-4 transition-transform active:scale-[0.92]"
        onClick={addSection}
      >
        <PlusIcon size={14} />
        <span className="text-xs font-medium">Новый блок</span>
      </button>
      <div className="w-full px-5">
        <ControlButtons
          disabled={!checkSections(sections)}
          onNext={onSubmit}
          label="ДАЛЕЕ"
        />
      </div>
    </div>
  );
};

const checkSections = (sections: WorkoutSection[]): boolean => {
  return sections.every((section) => {
    return section.title != "" && section.exercises.length > 0;
  });
};

const AddExerciseModal = ({
  children,
  onAdd: onAddParent,
}: {
  children: React.ReactNode;
  onAdd: (exercise: WorkoutExercise) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const exercises = useExercisesStore((state) => state.exercises);
  const [selectedExercise, setSelectedExercise] = React.useState<
    UUID | undefined
  >();

  const onAdd = React.useCallback(
    (exercise: WorkoutExercise) => {
      onAddParent(exercise);
      setOpen(false);
    },
    [onAddParent, setOpen],
  );

  return (
    <Drawer shouldScaleBackground={false} open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="m-auto h-[82vh] overflow-hidden lg:max-w-lg">
        <VisuallyHidden.Root>
          <DrawerTitle>Выбор упражнения</DrawerTitle>
          <DrawerDescription>Выбор упражнения</DrawerDescription>
        </VisuallyHidden.Root>
        <DrawerHandle />

        <ExercisesProvider exercises={exercises}>
          {selectedExercise ? (
            <WorkoutExerciseScreen
              exerciseId={selectedExercise}
              setSelectedExercise={setSelectedExercise}
              onAdd={onAdd}
            />
          ) : (
            <ExercisesListScreen selectExercise={setSelectedExercise} />
          )}
        </ExercisesProvider>
      </DrawerContent>
    </Drawer>
  );
};

const ExercisesListScreen = ({
  selectExercise,
}: {
  selectExercise?: (exercise: UUID) => void;
}) => {
  const exercises = useExercises();
  const [searchQuery, setSearchQuery] = useExercisesSearchQuery();
  const [, , activeFilters] = useExercisesFilters();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className="flex h-full w-full flex-col gap-6 overflow-y-auto px-5 pt-8 pb-5 lg:pt-7">
      <div className="flex items-center">
        <ExercisesFiltersModal asChild>
          <FiltersButton
            activeFilters={activeFilters}
            className={expanded ? "" : "z-10"}
          />
        </ExercisesFiltersModal>

        <HeaderSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          expanded={expanded}
          setExpanded={setExpanded}
          className="top-7"
        />
      </div>

      <div className="flex flex-col gap-4">
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => selectExercise?.(exercise.id)}
          >
            <ExerciseCard exercise={exercise} />
          </button>
        ))}
      </div>
    </div>
  );
};

const WorkoutExerciseScreen = ({
  exerciseId,
  setSelectedExercise,
  onAdd,
}: {
  exerciseId: UUID;
  setSelectedExercise?: (exercise: UUID | undefined) => void;
  onAdd: (exercise: WorkoutExercise) => void;
}) => {
  const { data: exercise, loading } = useDatabase<Exercise>(async () =>
    getExerciseFromDB(exerciseId),
  );

  return (
    <AnimatePresence>
      {loading && <Loading key="loading" />}
      {exercise && (
        <WorkoutExerciseScreenContent
          exercise={exercise}
          setSelectedExercise={setSelectedExercise}
          onAdd={onAdd}
        />
      )}
    </AnimatePresence>
  );
};

const WorkoutExerciseScreenContent = ({
  exercise,
  setSelectedExercise,
  onAdd,
}: {
  exercise: Exercise;
  setSelectedExercise?: (exercise: UUID | undefined) => void;
  onAdd: (exercise: WorkoutExercise) => void;
}) => {
  const equipment = React.useMemo(
    () =>
      exercise.equipment?.filter((e) => isWeightEquipment(e)) ?? [
        "body_weight",
      ],
    [exercise.equipment],
  );

  const [selectedEquipment, setSelectedEquipment] =
    React.useState<EquipmentType>(
      equipment.includes("body_weight") ? "body_weight" : equipment[0],
    );

  const [sets, setSets] = React.useState<WorkoutExerciseSet[]>([{ id: 1 }]);

  const addSet = React.useCallback(() => {
    setSets((prev) => [...prev, { id: prev.length + 1 }]);
  }, []);

  const updateSet = React.useCallback(
    (
      setId: number,
      update: (prev: WorkoutExerciseSet) => WorkoutExerciseSet,
    ) => {
      setSets((prev) => {
        return prev.map((s) => {
          if (s.id === setId) {
            return update(s);
          }
          return s;
        });
      });
    },
    [setSets],
  );

  const deleteSet = React.useCallback(
    (setId: number) => {
      setSets((prev) => {
        return prev.filter((s) => s.id !== setId);
      });
    },
    [setSets],
  );

  const onSubmit = React.useCallback(() => {
    const workoutExercise: WorkoutExercise = {
      ...exercise,
      sets,
      selectedEquipment,
    };
    setSelectedExercise?.(undefined);
    onAdd(workoutExercise);
  }, [exercise, sets, selectedEquipment, onAdd]);

  return (
    <ExerciseProvider exercise={exercise}>
      <Button
        size={"icon"}
        variant={"secondary"}
        className="absolute top-5 left-5 z-40"
        onClick={() => setSelectedExercise?.(undefined)}
      >
        <ArrowLeftIcon size={18} />
      </Button>
      <div className="bg-background-200 absolute inset-0 z-20 flex flex-col">
        <div className="flex-1 overflow-x-hidden overflow-y-auto pb-6">
          <div className="relative flex h-[45vh] w-full items-end justify-center bg-cover bg-center text-center">
            <ExerciseVideo videoSrc={exercise.video} />
            <h1 className="z-10 text-3xl font-black">{exercise.title}</h1>
          </div>
          <div className="px-5">
            <div className="my-3 flex items-center justify-center gap-2.5">
              <Select
                value={selectedEquipment}
                onValueChange={setSelectedEquipment}
              >
                <SelectTrigger asChild>
                  <div>
                    <ExerciseActionButton
                      label={
                        getEquipmentLabel(selectedEquipment) ??
                        "Собственный вес"
                      }
                      onClick={() => {}}
                    />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {equipment.map((equip) => (
                      <SelectItem key={equip} value={equip}>
                        {getEquipmentLabel(equip)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ExerciseNotesModal>
                <ExerciseActionButton label="Заметки" onClick={() => {}} />
              </ExerciseNotesModal>
            </div>
          </div>
          {!sets.every((set) =>
            isExerciseSafeForUser(
              set.weight,
              exercise.difficulty,
              20,
              30,
              undefined,
              set.reps,
              set.time,
            ),
          ) && (
            <div className="px-5 py-4">
              <div className="flex flex-col items-center gap-1.5 text-center text-amber-500">
                <h3 className="font-bold">Не переусердствуйте!</h3>
                <p className="text-xs text-balance">
                  Слишком большая нагрузка может навредить вашему здоровью
                </p>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 px-5">
            <table className="w-full table-fixed text-left">
              <thead className="text-muted-foreground border-b text-sm [&>tr>td]:py-2 [&>tr>td]:font-medium">
                <tr>
                  <td>Сет</td>
                  <td>Вес</td>
                  <td>
                    {exercise.type === ExerciseType.TIMED
                      ? "Время"
                      : "Повторений"}
                  </td>
                  <td />
                </tr>
              </thead>
              <tbody className="text-lg *:px-5 *:py-2 [&>tr>td]:py-3 [&>tr>td]:font-semibold [&>tr>td>input]:outline-none">
                {sets.map((set) => (
                  <SetRow
                    set={set}
                    updateSet={updateSet}
                    selectedEquipment={selectedEquipment}
                    exerciseType={exercise.type}
                    difficulty={exercise.difficulty}
                    key={set.id}
                    deleteSet={() => deleteSet(set.id)}
                  />
                ))}
              </tbody>
            </table>

            <button
              className="text-muted-foreground flex w-fit items-center gap-2 py-3 text-sm active:scale-[0.95]"
              onClick={addSet}
            >
              <PlusIcon size={14} />
              <span>Добавить сет</span>
            </button>
          </div>
        </div>
        <div className="w-full px-5 pb-(--bottom-button)">
          <Button
            disabled={!checkSets(sets, exercise.type, selectedEquipment)}
            onClick={onSubmit}
          >
            <PlusIcon size={18} />
            <span>ДОБАВИТЬ</span>
          </Button>
        </div>
      </div>
    </ExerciseProvider>
  );
};

const SetRow = ({
  set,
  updateSet,
  selectedEquipment,
  exerciseType,
  difficulty,
  deleteSet,
}: {
  set: WorkoutExerciseSet;
  updateSet: (
    setId: number,
    update: (prev: WorkoutExerciseSet) => WorkoutExerciseSet,
  ) => void;
  selectedEquipment: string;
  exerciseType: ExerciseType;
  difficulty: Difficulty;
  deleteSet: () => void;
}) => {
  const updateValues = React.useCallback(() => {
    if (exerciseType === ExerciseType.TIMED) {
      updateSet(set.id, (prev) => ({
        ...prev,
        time: calculateUserTime(40, difficulty, set.weight),
      }));
    } else {
      updateSet(set.id, (prev) => ({
        ...prev,
        reps: calculateUserReps(25, difficulty, set.weight),
      }));
    }
  }, [set.id, set.weight, difficulty, exerciseType, updateSet]);

  React.useEffect(() => {
    updateValues();
  }, [selectedEquipment, set.weight]);

  React.useEffect(() => {
    if (selectedEquipment === "body_weight") {
      updateSet(set.id, (prev) => ({ ...prev, weight: undefined }));
    } else {
      updateSet(set.id, (prev) => ({
        ...prev,
        weight: getDefaultWeight(selectedEquipment) ?? 10,
      }));
    }
  }, [selectedEquipment, updateSet, set.id]);

  const onWeightChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);

      if (
        ((!isNaN(value) && !e.target.value.includes(",")) || !e.target.value) &&
        (!e.target.value || e.target.valueAsNumber <= 300)
      ) {
        updateSet(set.id, (prev) => ({
          ...prev,
          weight: e.target.valueAsNumber,
        }));
      }
    },
    [set, updateSet, updateValues],
  );

  const onTimeChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);

      if (
        ((!isNaN(value) && !e.target.value.includes(",")) || !e.target.value) &&
        (!e.target.value || e.target.valueAsNumber <= 3600)
      ) {
        updateSet(set.id, (prev) => ({
          ...prev,
          time: e.target.valueAsNumber,
        }));
      }
    },
    [set, updateSet],
  );

  const onRepsChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);

      if (
        ((!isNaN(value) && !e.target.value.includes(",")) || !e.target.value) &&
        (!e.target.value || e.target.valueAsNumber <= 300)
      ) {
        updateSet(set.id, (prev) => ({
          ...prev,
          reps: e.target.valueAsNumber,
        }));
      }
    },
    [set, updateSet],
  );

  return (
    <tr>
      <td>{set.id}</td>
      <td>
        {selectedEquipment === "body_weight" ? (
          <span className="text-muted-foreground">--</span>
        ) : (
          <div className="flex items-center gap-[3px]">
            <input
              type="number"
              placeholder="10"
              value={set.weight}
              className="spin-hide outline-none"
              onChange={(e) => onWeightChange(e)}
              style={{
                width: set.weight ? `${set.weight.toString().length}ch` : "2ch",
              }}
            />
            <span>кг</span>
          </div>
        )}
      </td>
      <td>
        {exerciseType === ExerciseType.TIMED ? (
          <div className="flex items-center gap-[3px]">
            <input
              type="number"
              placeholder="30"
              value={set.time}
              className="spin-hide outline-none"
              onChange={(e) => onTimeChange(e)}
              style={{
                width: set.time ? `${set.time.toString().length}ch` : "2ch",
              }}
            />
            <span>сек</span>
          </div>
        ) : (
          <input
            type="number"
            placeholder="10"
            value={set.reps}
            className="spin-hide outline-none"
            onChange={(e) => onRepsChange(e)}
            style={{
              width: set.reps ? `${set.reps.toString().length}ch` : "2ch",
            }}
          />
        )}
      </td>
      <td className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-muted-foreground flex h-8 w-8 items-center justify-center">
              <MoreIcon size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="text-red-500" onClick={deleteSet}>
              Удалить
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

function checkSets(
  sets: WorkoutExerciseSet[],
  exerciseType: ExerciseType,
  selectedEquipment: EquipmentType,
): boolean {
  return (
    sets.length > 0 &&
    sets.every((set) => {
      let weight = true;
      if (selectedEquipment != "body_weight") {
        weight = (set.weight ?? 0) > 0;
      }

      let value;
      if (exerciseType === ExerciseType.QUANTITY) {
        value = (set.reps ?? 0) > 0;
      } else {
        value = (set.time ?? 0) > 0;
      }

      return weight && value;
    })
  );
}

const TagsScreen: CreateScreen = ({ next, prev }) => {
  const { tags, addTag } = useTagsStore();

  const [isAdding, setIsAdding] = React.useState(false);
  const [newTagName, setNewTagName] = React.useState("");

  const { setWorkoutObject } = useCreateWorkout();
  const [selectedTags, setSelectedTags] = React.useState<Tag[]>([]);

  const addSelectedTag = React.useCallback((tag: Tag) => {
    return () => {
      setSelectedTags((prev) => [...prev, tag]);
    };
  }, []);

  const removeSelectedTag = React.useCallback((tag: Tag) => {
    return () => {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };
  }, []);

  React.useEffect(() => {
    setWorkoutObject((prev) => ({ ...prev, tags: selectedTags }));
  }, [selectedTags]);

  const onSubmit = React.useCallback(async () => {
    setWorkoutObject((prev) => ({ ...prev, tags: selectedTags }));
    await next();
  }, [selectedTags, next]);

  const onTagCreate = React.useCallback(async () => {
    if (newTagName.trim() === "") {
      setIsAdding(false);
      setNewTagName("");
      return;
    }
    await addTag({ id: uuidv4(), label: newTagName });
    setIsAdding(false);
    setNewTagName("");
  }, [newTagName, setIsAdding, setNewTagName]);

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
