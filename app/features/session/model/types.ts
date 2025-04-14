import type { Workout } from "~/features/workout/model/types";
import type { UUID } from "~/shared/types/uuid";

export interface WorkoutSession {
  id: UUID;
  workout: Workout;

  completed?: boolean;
  canceled?: boolean;

  section?: number;
  exercise?: number;
  set?: number;

  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;

  results?: WorkoutSessionResults;
}

export interface WorkoutSessionResults {
  xp: {
    prev: number;
    new: number;
  };
  coins: {
    prev: number;
    new: number;
  };
}
