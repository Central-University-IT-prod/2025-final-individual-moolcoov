import type { Exercise } from "~/features/exercise/model/types";
import type { ResourceMedia } from "~/features/media/model/types";
import type { EquipmentType } from "~/shared/lib/equipment";
import type { Difficulty } from "~/shared/types/difficulty";
import type { Tag } from "~/features/tag/model/types";
import type { UUID } from "~/shared/types/uuid";

export interface Workout {
  id: UUID;
  title: string;
  workoutTime: number; // в мин
  difficulty: Difficulty;

  image?: ResourceMedia;

  equipment?: EquipmentType[];
  tags?: Tag[];

  sections: WorkoutSection[];

  createdAt: Date;
  editedAt?: Date;

  saved?: boolean;
}

export interface WorkoutSection {
  id: number;
  title: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise extends Exercise {
  sets: WorkoutExerciseSet[];
  selectedEquipment: EquipmentType;
}

export interface WorkoutExerciseSet {
  id: number;
  reps?: number;
  weight?: number;
  time?: number;
}

export interface WorkoutFilters {
  tags?: UUID[];
  difficulty?: Difficulty[];
  equipment?: EquipmentType[];
}
