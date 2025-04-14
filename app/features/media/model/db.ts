import { initDB } from "~/shared/lib/indexedDB";
import type { MediaItem } from "./types";
import type { UUID } from "~/shared/types/uuid";

export const MEDIA_STORE_NAME = "media";

export const addMediaToDB = async (media: MediaItem) => {
  const db = await initDB();

  if (!canStoreFile(media.size)) {
    throw Error("Not enough space");
  }

  return db.add(MEDIA_STORE_NAME, media);
};

export const getMediaFromDB = async (
  id?: UUID,
): Promise<MediaItem | undefined> => {
  if (!id) {
    return undefined;
  }
  const db = await initDB();
  return db.get(MEDIA_STORE_NAME, id);
};

export const deleteMediaFromDB = async (id?: UUID) => {
  if (!id) {
    return;
  }
  const db = await initDB();
  return db.delete(MEDIA_STORE_NAME, id);
};

export const deleteAllMediaFromDB = async () => {
  const db = await initDB();
  return db.clear(MEDIA_STORE_NAME);
};

export const getStorageUsage = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const { quota, usage } = await navigator.storage.estimate();
    return { quota: quota ?? 0, usage: usage ?? 0 };
  }
  return { quota: 0, usage: 0 };
};

export const canStoreFile = async (size: number) => {
  const { quota, usage } = await getStorageUsage();
  const availableSpace = quota - usage;
  return availableSpace >= size;
};
