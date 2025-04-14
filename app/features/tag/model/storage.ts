import type { Tag } from "./types";

export const getTags = () => {
  const tags = localStorage.getItem("tags");
  if (!tags) return [];
  return JSON.parse(tags);
};

export const updateTags = (tags: Tag[]) => {
  localStorage.setItem("tags", JSON.stringify(tags));
};

export const deleteTags = () => {
  localStorage.removeItem("tags");
};
