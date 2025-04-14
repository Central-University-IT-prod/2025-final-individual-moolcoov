import {
  DifficultyEasyIcon,
  DifficultyHardIcon,
  DifficultyMediumIcon,
} from "~/shared/ui/icons";
import { Difficulty } from "../types/difficulty";

export const getDifficultyLabel = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return "Легко";
    case Difficulty.MEDIUM:
      return "Средне";
    case Difficulty.HARD:
      return "Тяжело";
  }
};

export const getDifficultyIcon = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return DifficultyEasyIcon;
    case Difficulty.MEDIUM:
      return DifficultyMediumIcon;
    case Difficulty.HARD:
      return DifficultyHardIcon;
  }
};
