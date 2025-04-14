import {
  addExerciseToDB,
  deleteAllExercisesFromDB,
} from "~/features/exercise/model/db";
import { ExerciseType, type Exercise } from "~/features/exercise/model/types";
import { deleteAllMediaFromDB } from "~/features/media/model/db";
import { deleteAllSessionsFromDB } from "~/features/session/model/db";
import { deleteTags, updateTags } from "~/features/tag/model/storage";
import type { Tag } from "~/features/tag/model/types";
import { deleteUser, saveUser } from "~/features/user/model/storage";
import {
  addWorkoutToDB,
  deleteAllWorkoutsFromDB,
} from "~/features/workout/model/db";
import type { Workout } from "~/features/workout/model/types";
import { Difficulty } from "../types/difficulty";
import type { UserCreationObject } from "~/routes/onboarding/route";
import type { User } from "~/features/user/model/types";
import { getDefaultClothes } from "~/features/user/lib/character";

export const createEverything = async (userObject: UserCreationObject) => {
  await deleteEverything();

  try {
    if (
      !userObject.name ||
      !userObject.sex ||
      !userObject.height ||
      !userObject.weight
    ) {
      return;
    }

    const defaultClothes = getDefaultClothes();

    const user: User = {
      name: userObject.name,
      sex: userObject.sex,
      height: userObject.height,
      weight: userObject.weight,

      xp: 0,
      coins: 0,

      character: {
        hair: defaultClothes.hair.id,
        pants: defaultClothes.pants.id,
        boots: defaultClothes.boots.id,
        hat: defaultClothes.hat.id,
        item: defaultClothes.item.id,
      },
      availableClothes: [
        defaultClothes.hair.id,
        defaultClothes.pants.id,
        defaultClothes.boots.id,
        defaultClothes.hat.id,
        defaultClothes.item.id,
      ],
    };
    saveUser(user);

    updateTags(tags);

    exercises.forEach(async (e) => {
      await addExerciseToDB(e);
    });

    workouts.forEach(async (w) => {
      await addWorkoutToDB(w);
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteEverything = async () => {
  try {
    deleteUser();
    deleteTags();

    await deleteAllExercisesFromDB();
    await deleteAllWorkoutsFromDB();
    await deleteAllSessionsFromDB();
    await deleteAllMediaFromDB();
  } catch (e) {
    console.error(e);
  }
};

const tags: Tag[] = [
  { id: "id-tag-1", label: "кардио" },
  { id: "id-tag-2", label: "силовая" },
  { id: "id-tag-3", label: "выносливость" },
  { id: "id-tag-4", label: "гибкость" },
  { id: "id-tag-5", label: "растяжка" },
  { id: "id-tag-6", label: "разминка" },
  { id: "id-tag-7", label: "нижняя часть тела" },
  { id: "id-tag-8", label: "верхняя часть тела" },
  { id: "id-tag-9", label: "кор" },
  { id: "id-tag-10", label: "HIIT" },
  { id: "id-tag-11", label: "йога" },
  { id: "id-tag-12", label: "баланс" },
  { id: "id-tag-13", label: "начинающие" },
  { id: "id-tag-14", label: "интенсивная" },
  { id: "id-tag-15", label: "смешанная" },
  { id: "id-tag-16", label: "координация" },
];

const exercises: Exercise[] = [
  {
    id: "id-ex-1",
    title: "Приседания",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.MEDIUM,
    equipment: ["body_weight", "barbell", "kettlebell"],
    tags: [tags[1], tags[6]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/squats.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/squats.mp4",
    },
  },
  {
    id: "id-ex-2",
    title: "Отжимания",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight"],
    tags: [tags[1], tags[7]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/otjimaniya.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/otjimaniya.mp4",
    },
  },
  {
    id: "id-ex-3",
    title: "Планка",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight"],
    tags: [tags[8], tags[2]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/plank.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/plank.mp4",
    },
  },
  {
    id: "id-ex-4",
    title: "Бёрпи",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.HARD,
    equipment: ["body_weight"],
    tags: [tags[0], tags[1], tags[9]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/berpi.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/berpi.mp4",
    },
  },
  {
    id: "id-ex-5",
    title: "Жим штанги лежа",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.MEDIUM,
    equipment: ["barbell"],
    tags: [tags[1], tags[7]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/jim.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/jim.mp4",
    },
  },
  {
    id: "id-ex-6",
    title: "Подтягивания",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.HARD,
    equipment: ["body_weight", "pull_up_bar"],
    tags: [tags[1], tags[7]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/pullups.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/pullups.mp4",
    },
  },
  {
    id: "id-ex-7",
    title: "Скручивания",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight"],
    tags: [tags[8], tags[1]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/press.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/press.mp4",
    },
  },
  {
    id: "id-ex-8",
    title: "Гиревой мах",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.MEDIUM,
    equipment: ["kettlebell"],
    tags: [tags[1], tags[0], tags[6]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/kettlebell_up.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/kettlebell_up.mp4",
    },
  },
  {
    id: "id-ex-9",
    title: "Бег на месте",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight"],
    tags: [tags[0], tags[2]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/run.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/run.mp4",
    },
  },
  {
    id: "id-ex-10",
    title: "Прыжки на скакалке",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.MEDIUM,
    equipment: ["body_weight", "jump_rope"],
    tags: [tags[0], tags[2], tags[15]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/skakalka.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/skakalka.mp4",
    },
  },
  {
    id: "id-ex-11",
    title: "Выпады",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.MEDIUM,
    equipment: ["body_weight", "dumbbell"],
    tags: [tags[6], tags[11], tags[1]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/vypady.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/vypady.mp4",
    },
  },
  {
    id: "id-ex-12",
    title: "Сурья Намаскар",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight", "yoga_mat"],
    tags: [tags[10], tags[4], tags[3]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/yoga.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/yoga.mp4",
    },
  },
  {
    id: "id-ex-13",
    title: "Становая тяга",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.HARD,
    equipment: ["barbell"],
    tags: [tags[1], tags[6]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/barbell_up.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/barbell_up.mp4",
    },
  },
  {
    id: "id-ex-14",
    title: "Боковая планка",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.MEDIUM,
    equipment: ["body_weight"],
    tags: [tags[8], tags[12]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/side_plank.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/side_plank.mp4",
    },
  },
  {
    id: "id-ex-15",
    title: "Велосипедные скручивания",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight"],
    tags: [tags[8], tags[2]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/bicycle.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/bicycle.mp4",
    },
  },
  {
    id: "id-ex-16",
    title: "Скалолаз",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.HARD,
    equipment: ["body_weight"],
    tags: [tags[0], tags[1], tags[9]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/alpinist.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/alpinist.mp4",
    },
  },
  {
    id: "id-ex-17",
    title: "Супермен",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight"],
    tags: [tags[8], tags[1]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/superman.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/superman.mp4",
    },
  },
  {
    id: "id-ex-18",
    title: "Прыжки с приседом",
    type: ExerciseType.QUANTITY,
    difficulty: Difficulty.MEDIUM,
    equipment: ["body_weight"],
    tags: [tags[0], tags[1]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/jump.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/jump.mp4",
    },
  },
  {
    id: "id-ex-20",
    title: "Растяжка с экспандером",
    type: ExerciseType.TIMED,
    difficulty: Difficulty.EASY,
    equipment: ["body_weight", "resistance_band"],
    tags: [tags[4], tags[3]],
    createdAt: new Date(),
    image: {
      type: "external",
      externalSrc: "/exercises/photo/expander.png",
    },
    video: {
      type: "external",
      externalSrc: "/exercises/video/expander.mp4",
    },
  },
];

const workouts: Workout[] = [
  {
    id: "id-work-1",
    title: "Силовая тренировка для всего тела",
    workoutTime: 1800,
    difficulty: Difficulty.MEDIUM,
    image: {
      type: "external",
      externalSrc: "/workouts/silovaya-trenirovka.jpg",
    },
    equipment: ["body_weight", "barbell", "pull_up_bar", "dumbbell"],
    tags: [tags[1]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 90 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-1")!,
            sets: [
              { id: 1, reps: 15, weight: 20 },
              { id: 2, reps: 15, weight: 20 },
              { id: 3, reps: 15, weight: 20 },
            ],
            selectedEquipment: "barbell",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-2")!,
            sets: [
              { id: 1, reps: 20 },
              { id: 2, reps: 20 },
              { id: 3, reps: 20 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-6")!,
            sets: [
              { id: 1, reps: 8 },
              { id: 2, reps: 8 },
              { id: 3, reps: 8 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-7")!,
            sets: [
              { id: 1, reps: 25 },
              { id: 2, reps: 25 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-2",
    title: "HIIT тренировка",
    workoutTime: 1200,
    difficulty: Difficulty.HARD,
    image: {
      type: "external",
      externalSrc: "/workouts/hiit.jpg",
    },
    equipment: ["body_weight", "jump_rope"],
    tags: [tags[9], tags[0]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 90 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Интервалы",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-4")!,
            sets: [
              { id: 1, reps: 10 },
              { id: 2, reps: 10 },
              { id: 3, reps: 10 },
              { id: 4, reps: 10 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-10")!,
            sets: [
              { id: 1, time: 60 },
              { id: 2, time: 60 },
              { id: 3, time: 60 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заключительная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-3",
    title: "Кардио тренировка",
    workoutTime: 1500,
    difficulty: Difficulty.EASY,
    image: {
      type: "external",
      externalSrc: "/workouts/cardio.jpg",
    },
    equipment: ["body_weight"],
    tags: [tags[0], tags[2]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-4")!,
            sets: [
              { id: 1, reps: 12 },
              { id: 2, reps: 12 },
              { id: 3, reps: 12 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-10")!,
            sets: [
              { id: 1, time: 45 },
              { id: 2, time: 45 },
              { id: 3, time: 45 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-8")!,
            sets: [
              { id: 1, reps: 15, weight: 12 },
              { id: 2, reps: 15, weight: 12 },
              { id: 3, reps: 15, weight: 12 },
            ],
            selectedEquipment: "kettlebell",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-4",
    title: "Йога для расслабления",
    workoutTime: 2400,
    difficulty: Difficulty.EASY,
    image: {
      type: "external",
      externalSrc: "/workouts/yoga.jpg",
    },
    equipment: ["yoga_mat", "body_weight"],
    tags: [tags[10], tags[4], tags[3]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-12")!,
            sets: [{ id: 1, time: 300 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [
              { id: 1, time: 60 },
              { id: 2, time: 60 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-7")!,
            sets: [
              { id: 1, reps: 20 },
              { id: 2, reps: 20 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-2")!,
            sets: [{ id: 1, reps: 15 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-5",
    title: "Тренировка на выносливость",
    workoutTime: 1800,
    difficulty: Difficulty.MEDIUM,
    image: {
      type: "external",
      externalSrc: "/workouts/vinoslivost.jpg",
    },
    equipment: ["body_weight", "dumbbell", "kettlebell"],
    tags: [tags[2], tags[0]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-11")!,
            sets: [
              { id: 1, reps: 12, weight: 8 },
              { id: 2, reps: 12, weight: 8 },
              { id: 3, reps: 12, weight: 8 },
            ],
            selectedEquipment: "dumbbell",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-8")!,
            sets: [
              { id: 1, reps: 15, weight: 12 },
              { id: 2, reps: 15, weight: 12 },
              { id: 3, reps: 15, weight: 12 },
            ],
            selectedEquipment: "kettlebell",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-6",
    title: "Силовая тренировка с гирей",
    workoutTime: 1800,
    difficulty: Difficulty.MEDIUM,
    image: {
      type: "external",
      externalSrc: "/workouts/kettlebell.jpg",
    },
    equipment: ["kettlebell", "body_weight", "dumbbell"],
    tags: [tags[1], tags[6]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-8")!,
            sets: [
              { id: 1, reps: 15, weight: 12 },
              { id: 2, reps: 15, weight: 12 },
              { id: 3, reps: 15, weight: 12 },
              { id: 4, reps: 15, weight: 12 },
            ],
            selectedEquipment: "kettlebell",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-11")!,
            sets: [
              { id: 1, reps: 12, weight: 8 },
              { id: 2, reps: 12, weight: 8 },
              { id: 3, reps: 12, weight: 8 },
            ],
            selectedEquipment: "dumbbell",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-7",
    title: "Кардио-стретчинг",
    workoutTime: 1500,
    difficulty: Difficulty.EASY,
    image: {
      type: "external",
      externalSrc: "/workouts/stretching.jpg",
    },
    equipment: ["body_weight", "yoga_mat"],
    tags: [tags[0], tags[4]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-12")!,
            sets: [{ id: 1, time: 300 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-8",
    title: "Интенсивная HIIT тренировка",
    workoutTime: 1200,
    difficulty: Difficulty.HARD,
    image: {
      type: "external",
      externalSrc: "/workouts/hiit2.jpg",
    },
    equipment: ["body_weight", "jump_rope"],
    tags: [tags[9], tags[13]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Интервальная тренировка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-4")!,
            sets: [
              { id: 1, reps: 10 },
              { id: 2, reps: 10 },
              { id: 3, reps: 10 },
              { id: 4, reps: 10 },
              { id: 5, reps: 10 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-10")!,
            sets: [
              { id: 1, time: 45 },
              { id: 2, time: 45 },
              { id: 3, time: 45 },
              { id: 4, time: 45 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заключение",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-9",
    title: "Люблю печеньки с молочком",
    workoutTime: 1200,
    difficulty: Difficulty.EASY,
    image: {
      type: "external",
      externalSrc: "/character/clothes/item_milk_preview.png",
    },
    equipment: ["body_weight"],
    tags: [tags[13], tags[1]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 45 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-2")!,
            sets: [
              { id: 1, reps: 12 },
              { id: 2, reps: 12 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-1")!,
            sets: [
              { id: 1, reps: 15, weight: 20 },
              { id: 2, reps: 15, weight: 20 },
            ],
            selectedEquipment: "barbell",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-7")!,
            sets: [{ id: 1, reps: 20 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-10",
    title: "Смешанная тренировка",
    workoutTime: 2100,
    difficulty: Difficulty.MEDIUM,
    image: {
      type: "external",
      externalSrc: "/workouts/mixed.jpg",
    },
    equipment: [
      "body_weight",
      "barbell",
      "dumbbell",
      "jump_rope",
      "kettlebell",
    ],
    tags: [tags[14], tags[1], tags[0]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-5")!,
            sets: [
              { id: 1, reps: 10, weight: 20 },
              { id: 2, reps: 10, weight: 20 },
              { id: 3, reps: 10, weight: 20 },
            ],
            selectedEquipment: "barbell",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-11")!,
            sets: [
              { id: 1, reps: 12, weight: 8 },
              { id: 2, reps: 12, weight: 8 },
              { id: 3, reps: 12, weight: 8 },
            ],
            selectedEquipment: "dumbbell",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-10")!,
            sets: [
              { id: 1, time: 60 },
              { id: 2, time: 60 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-7")!,
            sets: [{ id: 1, reps: 20 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-11",
    title: "Поднял на бицепс пару тонн",
    workoutTime: 2400,
    difficulty: Difficulty.HARD,
    image: {
      type: "external",
      externalSrc: "/workouts/tons.jpg",
    },
    equipment: ["barbell", "body_weight"],
    tags: [tags[1], tags[6], tags[13]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Силовая часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-13")!,
            sets: [
              { id: 1, reps: 8, weight: 40 },
              { id: 2, reps: 8, weight: 40 },
              { id: 3, reps: 8, weight: 40 },
            ],
            selectedEquipment: "barbell",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-18")!,
            sets: [
              { id: 1, reps: 15 },
              { id: 2, reps: 15 },
              { id: 3, reps: 15 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-14")!,
            sets: [{ id: 1, time: 45 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Финиш",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-2")!,
            sets: [{ id: 1, reps: 20 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-12",
    title: "Кардио и функционал",
    workoutTime: 1500,
    difficulty: Difficulty.MEDIUM,
    image: {
      type: "external",
      externalSrc: "/workouts/cardio_functional.webp",
    },
    equipment: ["body_weight"],
    tags: [tags[0], tags[2], tags[9]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-9")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Функционал",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-16")!,
            sets: [
              { id: 1, time: 45 },
              { id: 2, time: 45 },
              { id: 3, time: 45 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-13",
    title: "Йога и растяжка комплекс",
    workoutTime: 2100,
    difficulty: Difficulty.EASY,
    image: {
      type: "external",
      externalSrc: "/workouts/yoga2.jpg",
    },
    equipment: ["yoga_mat", "resistance_band", "body_weight"],
    tags: [tags[10], tags[4], tags[3]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-12")!,
            sets: [{ id: 1, time: 300 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-20")!,
            sets: [
              { id: 1, time: 60 },
              { id: 2, time: 60 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-14")!,
            sets: [{ id: 1, time: 45 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Заминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-3")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
  {
    id: "id-work-14",
    title: "Функциональная тренировка",
    workoutTime: 1800,
    difficulty: Difficulty.MEDIUM,
    image: {
      type: "external",
      externalSrc: "/workouts/functional.png",
    },
    equipment: ["body_weight"],
    tags: [tags[15], tags[2]],
    sections: [
      {
        id: 1,
        title: "Разминка",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-2")!,
            sets: [{ id: 1, reps: 15 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 2,
        title: "Основная часть",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-15")!,
            sets: [
              { id: 1, reps: 20 },
              { id: 2, reps: 20 },
              { id: 3, reps: 20 },
            ],
            selectedEquipment: "body_weight",
          },
          {
            ...exercises.find((ex) => ex.id === "id-ex-17")!,
            sets: [{ id: 1, time: 60 }],
            selectedEquipment: "body_weight",
          },
        ],
      },
      {
        id: 3,
        title: "Финиш",
        exercises: [
          {
            ...exercises.find((ex) => ex.id === "id-ex-18")!,
            sets: [
              { id: 1, reps: 12 },
              { id: 2, reps: 12 },
              { id: 3, reps: 12 },
            ],
            selectedEquipment: "body_weight",
          },
        ],
      },
    ],
    createdAt: new Date(),
    saved: false,
  },
];
