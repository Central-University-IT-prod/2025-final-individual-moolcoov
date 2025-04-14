import { openDB } from "idb";
import React from "react";
import { EXERCISES_STORE_NAME } from "~/features/exercise/model/db";
import { MEDIA_STORE_NAME } from "~/features/media/model/db";
import { SESSIONS_STORE_NAME } from "~/features/session/model/db";
import { WORKOUTS_STORE_NAME } from "~/features/workout/model/db";

const DB_NAME = "workoutDB";
const VERSION = 2;

export const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(EXERCISES_STORE_NAME)) {
        db.createObjectStore(EXERCISES_STORE_NAME, {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains(WORKOUTS_STORE_NAME)) {
        db.createObjectStore(WORKOUTS_STORE_NAME, {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains(MEDIA_STORE_NAME)) {
        db.createObjectStore(MEDIA_STORE_NAME, {
          keyPath: "id",
        });
      }
      if (!db.objectStoreNames.contains(SESSIONS_STORE_NAME)) {
        db.createObjectStore(SESSIONS_STORE_NAME, {
          keyPath: "id",
        });
      }
    },
  });
};

export const useDatabase = <T>(fn: () => Promise<T>) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    fn()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { loading, data, error };
};
