import type { User } from "./types";

export const saveUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): User | undefined => {
  const user = localStorage.getItem("user");
  if (!user) return undefined;
  return JSON.parse(user);
};

export const updateUserStorage = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const deleteUser = () => {
  localStorage.removeItem("user");
};
