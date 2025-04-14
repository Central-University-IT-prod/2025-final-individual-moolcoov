import { redirect } from "react-router";
import { getWorkoutFromDB } from "~/features/workout/model/db";
import type { UUID } from "~/shared/types/uuid";
import { v4 as uuidv4 } from "uuid";
import type { WorkoutSession } from "~/features/session/model/types";
import { addSessionToDB } from "~/features/session/model/db";

export async function clientLoader({ params }: { params: { id: UUID } }) {
  const workout = await getWorkoutFromDB(params.id);

  if (!workout) {
    return redirect("/workouts");
  }

  const session: WorkoutSession = {
    id: uuidv4(),
    workout,
    createdAt: new Date(),
  };

  await addSessionToDB(session);

  return redirect(`/sessions/${session.id}`);
}

export default function StartWorkoutPage() {
  return null;
}
