import { initDB } from "~/shared/lib/indexedDB";
import type { Exercise } from "./types";
import type { UUID } from "~/shared/types/uuid";

export const EXERCISES_STORE_NAME = "exercises";

export const addExerciseToDB = async (exercise: Exercise) => {
  const db = await initDB();
  return db.add(EXERCISES_STORE_NAME, exercise);
};

export const getExercisesFromDB = async (): Promise<Exercise[]> => {
  const db = await initDB();
  return db.getAll(EXERCISES_STORE_NAME);
};

export const getExerciseFromDB = async (id: UUID): Promise<Exercise> => {
  const db = await initDB();
  return db.get(EXERCISES_STORE_NAME, id);
};

export const updateExerciseInDB = async (exercise: Exercise) => {
  const db = await initDB();
  return db.put(EXERCISES_STORE_NAME, exercise);
};

export const deleteExerciseFromDB = async (id: UUID) => {
  const db = await initDB();
  return db.delete(EXERCISES_STORE_NAME, id);
};

export const deleteAllExercisesFromDB = async () => {
  const db = await initDB();
  return db.clear(EXERCISES_STORE_NAME);
};
