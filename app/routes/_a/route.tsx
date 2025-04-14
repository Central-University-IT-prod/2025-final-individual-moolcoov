import React from "react";
import { Outlet, redirect, useNavigate, useSearchParams } from "react-router";
import { useExercisesStore } from "~/features/exercise/model/store";
import { useSessionsStore } from "~/features/session/model/store";
import { useTagsStore } from "~/features/tag/model/store";
import { getUser } from "~/features/user/model/storage";
import { useUserStore } from "~/features/user/model/store";
import { useWorkoutsStore } from "~/features/workout/model/store";
import InstallPromptTrigger from "~/shared/ui/InstallPrompt";

export const clientLoader = async ({ request }: { request: Request }) => {
  const data = new URL(request.url).searchParams.get("data");

  if (!data && !getUser()) {
    return redirect(`/onboarding`);
  }
};

export default function AppLayout() {
  const [searchParams] = useSearchParams();

  const { fetchExercises } = useExercisesStore();
  const { fetchWorkouts } = useWorkoutsStore();
  const { fetchSessions } = useSessionsStore();
  const { fetchUser } = useUserStore();
  const { fetchTags } = useTagsStore();

  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchExercises();
      await fetchWorkouts();
      await fetchSessions();
      await fetchUser();
      await fetchTags();
    };
    fetchData();
  }, []);

  React.useEffect(() => {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then((persistent) => {
        if (persistent) {
          console.log(
            "This app uses IndexedDB, your data won't wipe except by your explicit action.",
          );
        } else {
          console.warn(
            "This app uses IndexedDB, but storage may be cleared by the UA under storage pressure.",
          );
        }
      });
    }
  }, []);

  React.useEffect(() => {
    if (!getUser()) {
      navigate({
        pathname: "/onboarding",
        search: searchParams.toString(),
      });
    }
  }, [searchParams]);

  return (
    <>
      <Outlet />
      <InstallPromptTrigger />
    </>
  );
}
