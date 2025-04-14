import { initDB } from "~/shared/lib/indexedDB";
import type { WorkoutSession } from "./types";
import type { UUID } from "~/shared/types/uuid";

export const SESSIONS_STORE_NAME = "sessions";

export const getSessionFromDB = async (id: UUID) => {
  const db = await initDB();
  return db.get(SESSIONS_STORE_NAME, id);
};

export const getSessionsFromDB = async () => {
  const db = await initDB();
  return db.getAll(SESSIONS_STORE_NAME);
};

export const addSessionToDB = async (session: WorkoutSession) => {
  const db = await initDB();
  return db.add(SESSIONS_STORE_NAME, session);
};

export const updateSessionInDB = async (session: WorkoutSession) => {
  const db = await initDB();
  return db.put(SESSIONS_STORE_NAME, session);
};

export const deleteAllSessionsFromDB = async () => {
  const db = await initDB();
  return db.clear(SESSIONS_STORE_NAME);
};
