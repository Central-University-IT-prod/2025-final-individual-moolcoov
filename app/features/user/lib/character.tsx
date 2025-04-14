import type { UserCharacter, UserSex } from "../model/types";
import { getXPLevel } from "./xp";

export interface Clothes {
  id: string;
  title: string;
  image: string;
  preview?: string;
  price?: number;
  type: ClothesType;
}

type ClothesType = "hair" | "pants" | "boots" | "item" | "hat";

const characterBase = {
  male: {
    weak: "/character/male_weak.png",
    ok: "/character/male_ok.png",
    good: "/character/male_good.png",
    best: "/character/male_best.png",
  },

  female: {
    weak: "/character/male_weak.png",
    ok: "/character/male_ok.png",
    good: "/character/male_good.png",
    best: "/character/male_best.png",
  },
};

const clothes: Clothes[] = [
  {
    id: "no_hat",
    image: "",
    title: "Без шляпы",
    preview: "",
    price: 0,
    type: "hat",
  },
  {
    id: "no_item",
    image: "",
    title: "Без предмета",
    preview: "",
    price: 0,
    type: "item",
  },
  {
    id: "brown_hair",
    image: "/character/clothes/hair_brown.png",
    title: "О да шотен я",
    preview: "/character/clothes/hair_brown_preview.png",
    price: 0,
    type: "hair",
  },
  {
    id: "blue_hair",
    image: "/character/clothes/hair_blue.png",
    title: "Цвет настроения синий",
    preview: "/character/clothes/hair_blue_preview.png",
    price: 100,
    type: "hair",
  },
  {
    id: "white_hair",
    image: "/character/clothes/hair_white.png",
    title: "#FFFFFF",
    preview: "/character/clothes/hair_white_preview.png",
    price: 444,
    type: "hair",
  },
  {
    id: "shnike_pants",
    image: "/character/clothes/pants_shnike.png",
    title: "Штаны Шнайк",
    preview: "/character/clothes/pants_shnike_preview.png",
    price: 0,
    type: "pants",
  },
  {
    id: "latex_pants",
    image: "/character/clothes/pants_latex.png",
    title: "Штаны на выход",
    preview: "/character/clothes/pants_latex_preview.png",
    price: 250,
    type: "pants",
  },
  {
    id: "shnike_boots",
    image: "/character/clothes/boots_shnike.png",
    title: "Ботинки Шнайк",
    preview: "/character/clothes/boots_shnike_preview.png",
    price: 0,
    type: "boots",
  },
  {
    id: "cowboy_boots",
    image: "/character/clothes/boots_cowboy.png",
    title: "Дикий как Дикий Запад",
    preview: "/character/clothes/boots_cowboy_preview.png",
    price: 454,
    type: "boots",
  },
  {
    id: "crown_hat",
    image: "/character/clothes/hat_crown.png",
    title: "Король зала",
    preview: "/character/clothes/hat_crown_preview.png",
    price: 999,
    type: "hat",
  },
  {
    id: "lottie_hat",
    image: "/character/clothes/hat_lottie.png",
    title: "упал — вставай",
    preview: "/character/clothes/hat_lottie_preview.png",
    price: 90,
    type: "hat",
  },
  {
    id: "ferris_item",
    image: "/character/clothes/item_ferris.png",
    title: "Хотя бы не в чулках",
    preview: "/character/clothes/item_ferris_preview.png",
    price: 300,
    type: "item",
  },
  {
    id: "protein_item",
    image: "/character/clothes/item_protein.png",
    title: "к чаю",
    preview: "/character/clothes/item_protein_preview.png",
    price: 200,
    type: "item",
  },
  {
    id: "disco_pants",
    image: "/character/clothes/pants_disco.png",
    title: "Качок диско",
    preview: "/character/clothes/pants_disco_preview.png",
    price: 555,
    type: "pants",
  },
  {
    id: "milk_item",
    image: "/character/clothes/item_milk.png",
    title: "Люблю печеньки с молочком",
    preview: "/character/clothes/item_milk_preview.png",
    price: 120,
    type: "item",
  },
];

const defaultClothes = {
  hair: clothes.find((item) => item.id === "brown_hair") as Clothes,
  pants: clothes.find((item) => item.id === "shnike_pants") as Clothes,
  boots: clothes.find((item) => item.id === "shnike_boots") as Clothes,
  hat: clothes.find((item) => item.id === "no_hat") as Clothes,
  item: clothes.find((item) => item.id === "no_item") as Clothes,
};

export const getCharacter = (
  sex: UserSex,
  xp: number,
  character: UserCharacter,
) => {
  const hair = clothes.find((item) => item.id === character.hair);
  const pants = clothes.find((item) => item.id === character.pants);
  const boots = clothes.find((item) => item.id === character.boots);
  const hat = clothes.find((item) => item.id === character.hat);
  const item = clothes.find((item) => item.id === character.item);

  return {
    base: getCharacterBase(sex, xp),
    hair: hair ?? defaultClothes.hair,
    pants: pants ?? defaultClothes.pants,
    boots: boots ?? defaultClothes.boots,
    hat: hat,
    item: item,
  };
};

export const getDefaultClothes = () => {
  return defaultClothes;
};

export interface CharacterClothes {
  hair: Clothes[];
  pants: Clothes[];
  boots: Clothes[];
  hats: Clothes[];
  items: Clothes[];
}

export const getAvailableClothes = (
  availableClothes?: string[],
): CharacterClothes => {
  return {
    hair: clothes.filter(
      (item) => item.type === "hair" && availableClothes?.includes(item.id),
    ),
    pants: clothes.filter(
      (item) => item.type === "pants" && availableClothes?.includes(item.id),
    ),
    boots: clothes.filter(
      (item) => item.type === "boots" && availableClothes?.includes(item.id),
    ),
    hats: clothes.filter(
      (item) => item.type === "hat" && availableClothes?.includes(item.id),
    ),
    items: clothes.filter(
      (item) => item.type === "item" && availableClothes?.includes(item.id),
    ),
  };
};

export const getClothes = () => {
  return clothes;
};

export const getClothesTypeLabel = (type: ClothesType) => {
  switch (type) {
    case "hair":
      return "Волосы";
    case "pants":
      return "Штаны";
    case "boots":
      return "Ботинки";
    case "item":
      return "Предмет";
    case "hat":
      return "Шляпа";
  }
};

export const getCharacterBase = (sex: UserSex, xp: number) => {
  const level = getXPLevel(xp);
  const base = characterBase[sex];

  if (level >= 9) {
    return base.best;
  }

  if (level >= 6) {
    return base.good;
  }

  if (level >= 3) {
    return base.ok;
  }

  return base.weak;
};

export const getLevelsUntilTransformation = (xp: number) => {
  const level = getXPLevel(xp);

  if (level >= 9) {
    return null;
  }

  if (level >= 6) {
    return 9 - level;
  }

  if (level >= 3) {
    return 6 - level;
  }

  return 3 - level;
};
