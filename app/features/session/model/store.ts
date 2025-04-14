import { create } from "zustand";
import type { WorkoutSession } from "./types";
import { getSessionsFromDB, updateSessionInDB } from "./db";

interface SessionsState {
  sessions: WorkoutSession[];
  loading: boolean;

  fetchSessions: () => Promise<void>;
  updateSession: (session: WorkoutSession) => Promise<void>;
}

const useSessionsStore = create<SessionsState>((set, get) => ({
  sessions: [],
  loading: true,

  fetchSessions: async () => {
    set({ loading: true });
    const sessions: WorkoutSession[] = (await getSessionsFromDB()).sort(
      (a: WorkoutSession, b: WorkoutSession) =>
        b.createdAt.getTime() - a.createdAt.getTime(),
    );

    set({ sessions, loading: false });
  },

  updateSession: async (session) => {
    await updateSessionInDB(session);
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === session.id ? session : s)),
    }));
  },
}));

export { useSessionsStore };
