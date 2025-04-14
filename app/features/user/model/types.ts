export interface User {
  name: string;
  sex: UserSex;
  weight: UserParameter;
  height: UserParameter;

  xp: number;
  coins: number;

  character: UserCharacter;
  availableClothes: string[];
}

export type UserSex = "male" | "female";

export interface UserParameter {
  value: number;
  date: Date;
}

export interface UserCharacter {
  hair: string;
  pants: string;
  boots: string;
  hat: string;
  item: string;
}
