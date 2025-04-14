import { motion } from "motion/react";
import {
  getCharacter,
  getLevelsUntilTransformation,
} from "~/features/user/lib/character";
import { useUserStore } from "~/features/user/model/store";
import type { User } from "~/features/user/model/types";

export const CharacterProfile = () => {
  const user = useUserStore((state) => state.user);

  return (
    <div className="bg-background-200 h-auto w-full border-b lg:rounded-3xl lg:border">
      {user && <Character user={user} />}
    </div>
  );
};

const Character = ({ user }: { user: User }) => {
  const character = getCharacter(user.sex, user.xp, user.character);
  const levels = getLevelsUntilTransformation(user.xp);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.5 } }}
      className="relative aspect-7/8 h-auto max-h-[650px] w-full [&>img]:pointer-events-none [&>img]:absolute [&>img]:inset-0 [&>img]:m-auto [&>img]:aspect-7/8 [&>img]:h-full [&>img]:w-auto [&>img]:select-none"
    >
      {character.hat?.image && (
        <img className="z-[4]" src={character.hat.image} alt="Шляпа" />
      )}
      {character.item?.image && (
        <img className="z-[3]" src={character.item.image} alt="Предмет" />
      )}
      <img className="z-[2]" src={character.hair?.image} alt="Волосы" />
      <img className="z-0" src={character.base} alt="База" />
      <img className="z-[1]" src={character.pants?.image} alt="Штаны" />
      <img className="z-[2]" src={character.boots?.image} alt="Ботинки" />
      {levels && (
        <p className="text-muted-foreground absolute bottom-3 left-0 z-10 h-fit w-full text-center text-sm font-medium">
          До следующей трансформации {levels} ур
        </p>
      )}
    </motion.div>
  );
};
