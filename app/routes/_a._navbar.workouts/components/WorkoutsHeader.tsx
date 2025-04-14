import { motion } from "motion/react";
import React from "react";
import { getXPLevel } from "~/features/user/lib/xp";
import { getUser } from "~/features/user/model/storage";
import { UserLevelModal } from "~/features/user/ui/UserLevelModal";
import { UserStoreModal } from "~/features/user/ui/UserStoreModal";
import { useWorkoutsSearchQuery } from "~/features/workout/model/WorkoutsProvider";
import { HeaderSearch } from "~/shared/ui/HeaderSearch";
import { DumbBellColoredIcon, LottieCoinIcon } from "~/shared/ui/icons";

export const WorkoutsHeader = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = useWorkoutsSearchQuery();
  const user = getUser();

  return (
    <header className="bg-background-200 sticky top-0 z-20 flex h-18 w-full shrink-0 grow-0 basis-auto border-b px-5 lg:top-5 lg:mt-5 lg:w-96 lg:rounded-3xl lg:border lg:px-8">
      <motion.div
        className="z-10 flex items-center justify-center gap-8 lg:w-full lg:gap-0"
        animate={
          expanded
            ? { opacity: 0, transform: "translateX(-10px)" }
            : { opacity: 1, transform: "translateX(0px)" }
        }
      >
        <UserLevelModal>
          <div
            className="flex items-center justify-center gap-2 transition-transform outline-none active:scale-[0.95] lg:flex-1"
            role="button"
          >
            <DumbBellColoredIcon size={32} />
            <span className="text-xp font-bold">{getXPLevel(user?.xp)} ур</span>
          </div>
        </UserLevelModal>
        <UserStoreModal>
          <div
            className="flex items-center justify-center gap-2 transition-transform outline-none active:scale-[0.95] lg:flex-1"
            role="button"
          >
            <LottieCoinIcon size={26} />
            <span className="text-lottie font-bold">{user?.coins ?? 0}</span>
          </div>
        </UserStoreModal>
      </motion.div>

      <HeaderSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expanded={expanded}
        setExpanded={setExpanded}
      />
    </header>
  );
};
