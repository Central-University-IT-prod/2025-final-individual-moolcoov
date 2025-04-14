import type { ResourceMedia } from "~/features/media/model/types";
import type { EquipmentType } from "~/shared/lib/equipment";
import type { Difficulty } from "~/shared/types/difficulty";
import type { Tag } from "~/features/tag/model/types";
import type { UUID } from "~/shared/types/uuid";

export interface Exercise {
  id: UUID;
  title: string;
  type: ExerciseType;
  difficulty: Difficulty;
  equipment?: EquipmentType[];
  tags?: Tag[];

  notes?: string;

  createdAt: Date;
  editedAt?: Date;

  image?: ResourceMedia;
  video?: ResourceMedia;
}

export enum ExerciseType {
  QUANTITY = "quantity",
  TIMED = "timed",
}

export interface ExerciseFilters {
  tags?: UUID[];
  difficulty?: Difficulty[];
  equipment?: EquipmentType[];
}
