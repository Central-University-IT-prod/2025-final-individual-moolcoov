import {
  HeartIcon,
  ShareIcon,
  PencilIcon,
  HeartFillIcon,
} from "~/shared/ui/icons";
import { useWorkout } from "./WorkoutProvider";
import React, { useState } from "react";
import { useWorkoutsStore } from "~/features/workout/model/store";
import { WorkoutShareModal } from "~/features/workout/ui/WorkoutShareModal";

export const WorkoutActions = () => {
  const workout = useWorkout();
  const updateWorkout = useWorkoutsStore((state) => state.updateWorkout);

  const [saved, setSaved] = useState(workout.saved ?? false);

  React.useEffect(() => {
    if (saved !== (workout.saved ?? false)) {
      updateWorkout({ ...workout, saved });
    }
  }, [saved, workout]);

  return (
    <div className="mt-8 flex items-center justify-center gap-8">
      <Action
        icon={saved ? <HeartFillIcon className="text-white" /> : <HeartIcon />}
        label={saved ? "Сохранено" : "Сохранить"}
        onClick={() => setSaved(!saved)}
      />
      <WorkoutShareModal workout={workout}>
        <Action icon={<ShareIcon />} label="Поделиться" onClick={() => {}} />
      </WorkoutShareModal>
    </div>
  );
};

interface ActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const Action = ({ icon, label, onClick }: ActionProps) => {
  return (
    <button
      className="text-muted-foreground flex flex-col items-center gap-1.5"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};
