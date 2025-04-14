import type { UUID } from "~/shared/types/uuid";

export interface MediaItem {
  id: UUID;
  type: MediaType;
  data: Blob;
  size: number;
}

export interface ResourceMedia {
  type: "stored" | "external";
  storedId?: UUID;
  externalSrc?: string;
}

export type MediaType = "photo" | "video";
