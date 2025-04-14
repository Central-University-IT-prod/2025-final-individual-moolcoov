import React from "react";
import type { WorkoutSession } from "./types";
import type { Workout } from "~/features/workout/model/types";
import { updateSessionInDB } from "./db";
import { useNavigate } from "react-router";

const SET_REST_TIME = 20;
const EXERCISE_REST_TIME = 20;
const SECTION_REST_TIME = 40;

interface SessionContextType {
  session: WorkoutSession;
  setSession: React.Dispatch<React.SetStateAction<WorkoutSession>>;

  state: SessionState;
  dispatch: React.Dispatch<SessionAction>;

  workout: Workout;

  cancelSession: () => Promise<void>;
}

const SessionContext = React.createContext<SessionContextType | undefined>(
  undefined,
);

interface SessionProviderProps {
  session: WorkoutSession;
  children?: React.ReactNode;
  onComplete?: (session: WorkoutSession) => Promise<void>;
}

interface SessionState {
  currentSection?: number;
  currentExercise?: number;
  currentSet?: number;
  status: "start" | "exercise" | "rest" | "finished";

  restType?: "set" | "exercise" | "section";

  timer: number;
}

type SessionAction =
  | { type: "START" }
  | { type: "COMPLETE_SET" }
  | { type: "COMPLETE_SET_BREAK" }
  | { type: "COMPLETE_EXERCISE" }
  | { type: "COMPLETE_EXERCISE_BREAK" }
  | { type: "COMPLETE_SECTION" }
  | { type: "COMPLETE_SECTION_BREAK" }
  | { type: "FINISH" }
  | { type: "TICK" };

const reducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "exercise",
        currentSection: 0,
        currentExercise: 0,
        currentSet: 0,
        timer: 0,
      };
    case "COMPLETE_SET":
      return {
        ...state,
        currentSet: (state.currentSet ?? 0) + 1,
        status: "rest",
        timer: SET_REST_TIME,
        restType: "set",
      };
    case "COMPLETE_SET_BREAK":
      return {
        ...state,
        status: "exercise",
        timer: 0,
        restType: undefined,
      };
    case "COMPLETE_EXERCISE":
      return {
        ...state,
        currentExercise: (state.currentExercise ?? 0) + 1,
        currentSet: undefined,
        status: "rest",
        timer: EXERCISE_REST_TIME,
        restType: "exercise",
      };
    case "COMPLETE_EXERCISE_BREAK":
      return {
        ...state,
        status: "exercise",
        currentSet: 0,
        timer: 0,
        restType: undefined,
      };
    case "COMPLETE_SECTION":
      return {
        ...state,
        currentSection: (state.currentSection ?? 0) + 1,
        currentExercise: undefined,
        currentSet: undefined,
        status: "rest",
        timer: SECTION_REST_TIME,
        restType: "section",
      };
    case "COMPLETE_SECTION_BREAK":
      return {
        ...state,
        status: "exercise",
        currentExercise: 0,
        currentSet: 0,
        timer: 0,
        restType: undefined,
      };
    case "FINISH":
      return {
        ...state,
        status: "finished",
        timer: 0,
        restType: undefined,
      };
    case "TICK":
      return {
        ...state,
        timer: state.timer - 1,
      };
    default:
      return state;
  }
};

export const SessionProvider = ({
  session: sessionRef,
  children,
  onComplete,
}: SessionProviderProps) => {
  const [session, setSession] = React.useState(sessionRef);
  const navigate = useNavigate();
  const update = React.useRef(true);

  const [state, dispatch] = React.useReducer(reducer, {
    status: session.section != undefined ? "exercise" : "start",
    timer: 10,
    currentSection: session.section,
    currentExercise: session.exercise,
    currentSet: session.set,
  });

  React.useEffect(() => {
    const finish = async () => {
      await onComplete?.(session);
    };

    if (state.status === "finished" && update.current) {
      update.current = false;
      finish();
    }
  }, [state.status, session, onComplete, update.current]);

  React.useEffect(() => {
    const newSession = {
      ...session,
      section: state.currentSection,
      exercise: state.currentExercise,
      set: state.currentSet,
    };

    const timeout = setTimeout(() => {
      if (update.current) {
        updateSessionInDB(newSession);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state, session, update.current]);

  const cancelSession = React.useCallback(async () => {
    await updateSessionInDB({
      ...session,
      canceled: true,
    });
    navigate("/workouts");
  }, [session, navigate]);

  return (
    <SessionContext.Provider
      value={{
        session,
        workout: session.workout,
        state,
        dispatch,
        setSession,
        cancelSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context.session;
};

export const useSessionWorkout = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionWorkout must be used within a SessionProvider");
  }
  return context.workout;
};

export const useSessionState = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionState must be used within a SessionProvider");
  }
  return { state: context.state, dispatch: context.dispatch };
};

export const useSetSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSetSession must be used within a SessionProvider");
  }
  return context.setSession;
};

export const useCancelSession = () => {
  const context = React.useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useCancelSession must be used within a SessionProvider");
  }
  return context.cancelSession;
};

export function completeExercise(
  state: SessionState,
  dispatch: React.Dispatch<SessionAction>,
  workout: Workout,
) {
  const section = workout.sections[state.currentSection ?? 0];
  const exercise = section.exercises[state.currentExercise ?? 0];

  if ((state.currentSet ?? 0) < exercise.sets.length - 1) {
    dispatch({ type: "COMPLETE_SET" });
    return;
  }

  if ((state.currentExercise ?? 0) < section.exercises.length - 1) {
    dispatch({ type: "COMPLETE_EXERCISE" });
    return;
  }

  if ((state.currentSection ?? 0) < workout.sections.length - 1) {
    dispatch({ type: "COMPLETE_SECTION" });
    return;
  }

  dispatch({ type: "FINISH" });
}

export function completeRest(
  state: SessionState,
  dispatch: React.Dispatch<SessionAction>,
) {
  if (state.status === "start") {
    dispatch({ type: "START" });
    return;
  }

  if (state.currentExercise === undefined) {
    dispatch({ type: "COMPLETE_SECTION_BREAK" });
    return;
  }

  if (state.currentSet === undefined) {
    dispatch({ type: "COMPLETE_EXERCISE_BREAK" });
    return;
  }

  dispatch({ type: "COMPLETE_SET_BREAK" });
}
