import {
  useWorkoutsSearchQuery,
  WorkoutsProvider,
} from "~/features/workout/model/WorkoutsProvider";
import { WorkoutsSavedList } from "./components/WorkoutsSavedList";
import { WorkoutsList } from "./components/WorkoutsList";
import { WorkoutsHeader } from "./components/WorkoutsHeader";
import { useWorkoutsStore } from "~/features/workout/model/store";
import { AnimatePresence } from "motion/react";
import { Loading } from "~/shared/ui/Loading";
import { SessionResumeButton } from "~/features/session/ui/SessionResumeButton";
import { useSessionsStore } from "~/features/session/model/store";
import { SearchBar } from "~/shared/ui/SearchBar";
import { useSearchParams } from "react-router";
import { WorkoutAddSharedModal } from "~/features/workout/ui/WorkoutsAddSharedModal";

export default function WorkoutsPage() {
  const { workouts, loading } = useWorkoutsStore();
  const [params] = useSearchParams();

  const workoutData = params.get("data");

  return (
    <AnimatePresence>
      {loading && <Loading key={"loading"} />}
      {workouts && (
        <WorkoutsProvider workouts={workouts}>
          <div className="flex-row-reverse gap-10 lg:flex lg:px-6">
            <WorkoutsHeader />
            <div className="flex min-w-0 flex-1 flex-col gap-8 pt-6">
              <Search />
              <Content />
            </div>
          </div>
          {workoutData && <WorkoutAddSharedModal workoutData={workoutData} />}
        </WorkoutsProvider>
      )}
    </AnimatePresence>
  );
}

const Content = () => {
  const [searchQuery] = useWorkoutsSearchQuery();
  const sessions = useSessionsStore((state) => state.sessions);

  if (searchQuery !== "") {
    return <WorkoutsList />;
  }

  return (
    <>
      {sessions.at(0) && !sessions[0].completed && !sessions[0].canceled && (
        <div className="px-5 lg:px-0">
          <SessionResumeButton session={sessions[0]} />
        </div>
      )}

      <WorkoutsSavedList />
      <WorkoutsList />
    </>
  );
};

const Search = () => {
  const [searchQuery, setSearchQuery] = useWorkoutsSearchQuery();

  return (
    <div className="hidden lg:block">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
};
