import React from "react";
import { redirect, useNavigate } from "react-router";
import { getUser } from "~/features/user/model/storage";

export const clientLoader = async () => {
  if (getUser()) {
    return redirect("/workouts");
  } else {
    return redirect("/onboarding");
  }
};

export default function IndexPage() {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (getUser()) {
      navigate("/workouts");
    } else {
      navigate("/onboarding");
    }
  }, []);

  return null;
}
