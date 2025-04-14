import { create } from "zustand";
import type { Workout } from "./types";
import {
  addWorkoutToDB,
  deleteWorkoutFromDB,
  getWorkoutsFromDB,
  updateWorkoutInDB,
} from "./db";
import type { UUID } from "~/shared/types/uuid";

interface WorkoutsState {
  workouts: Workout[];
  loading: boolean;

  fetchWorkouts: () => Promise<void>;
  addWorkout: (workout: Workout) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: UUID) => Promise<void>;
}

const useWorkoutsStore = create<WorkoutsState>((set, get) => ({
  workouts: [],
  loading: true,

  fetchWorkouts: async () => {
    set({ loading: true });
    const workouts: Workout[] = (await getWorkoutsFromDB()).sort(
      (a: Workout, b: Workout) =>
        (b.editedAt ?? b.createdAt).getTime() -
        (a.editedAt ?? a.createdAt).getTime(),
    );
    set({ workouts, loading: false });
  },

  addWorkout: async (workout) => {
    await addWorkoutToDB(workout);
    set((state) => ({
      workouts: [workout, ...state.workouts],
    }));
  },

  updateWorkout: async (workout) => {
    await updateWorkoutInDB(workout);
    set((state) => ({
      workouts: state.workouts.map((w) => (w.id === workout.id ? workout : w)),
    }));
  },

  deleteWorkout: async (id) => {
    await deleteWorkoutFromDB(id);
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    }));
  },
}));

export { useWorkoutsStore };
