import {
  ExercisesProvider,
  useExercisesSearchQuery,
} from "~/features/exercise/model/ExercisesProvider";
import { ExercisesList } from "~/routes/_a._navbar.exercises/components/ExercisesList";
import { ExercisesInfo } from "./components/ExercisesInfo";
import { ExercisesHeader } from "./components/ExercisesHeader";
import { useExercisesStore } from "~/features/exercise/model/store";
import { useShallow } from "zustand/react/shallow";
import { Loading } from "~/shared/ui/Loading";
import { AnimatePresence } from "motion/react";
import { CreateExerciseButton } from "./components/CreateExerciseButton";
import { SearchBar } from "~/shared/ui/SearchBar";
import { Button } from "~/shared/ui/Button";
import { PlusIcon } from "~/shared/ui/icons";
import { ExerciseCreateModal } from "~/features/exercise/ui/ExerciseCreateModal";

export default function ExercisesPage() {
  const [exercises, loading] = useExercisesStore(
    useShallow((state) => [state.exercises, state.loading]),
  );

  return (
    <ExercisesProvider exercises={exercises}>
      <ExercisesHeader />

      <AnimatePresence>
        {loading && <Loading />}

        {!loading && (
          <div className="flex flex-col gap-5 px-5 pt-5 pb-[62px] lg:gap-6 lg:px-6 lg:pt-6 lg:pb-0">
            <Search />
            <ExercisesInfo />

            <ExercisesList />
          </div>
        )}
      </AnimatePresence>

      <CreateExerciseButton />
    </ExercisesProvider>
  );
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useExercisesSearchQuery();

  return (
    <div className="hidden w-full items-center gap-4 lg:flex">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <ExerciseCreateModal>
        <Button variant={"secondary"} className="hidden max-w-14 lg:flex">
          <PlusIcon size={20} />
        </Button>
      </ExerciseCreateModal>
    </div>
  );
};
