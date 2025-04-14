import { create } from "zustand";
import type { Tag } from "./types";
import { getTags, updateTags } from "./storage";

interface TagsState {
  tags: Tag[];
  loading: boolean;

  fetchTags: () => Promise<void>;
  addTag: (tag: Tag) => Promise<void>;
}

const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  loading: true,

  fetchTags: async () => {
    set({ loading: true });
    const tags = getTags();
    set({ tags, loading: false });
  },

  addTag: async (tag) => {
    const newTags = [tag, ...get().tags];
    updateTags(newTags);
    set({ tags: newTags });
  },
}));

export { useTagsStore };
