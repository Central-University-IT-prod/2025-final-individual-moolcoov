import { motion } from "motion/react";
import { MagnifierIcon } from "./icons";
import { cn } from "../lib/utils";

interface HeaderSearchProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;

  className?: string;
}

export const HeaderSearch = ({
  searchQuery,
  setSearchQuery,
  expanded,
  setExpanded,
  className,
}: HeaderSearchProps) => {
  return (
    <div
      className={cn(
        "absolute top-4 right-0 flex w-[100dvw] justify-end gap-3 px-5 lg:hidden",
        className,
      )}
    >
      <motion.div
        className="bg-muted flex h-10 w-10 min-w-[40px] items-center gap-2 overflow-hidden rounded-full px-3"
        animate={expanded ? { width: "100%" } : { width: "40px" }}
      >
        <motion.button
          className="flex h-10 w-10 items-center justify-center"
          animate={expanded ? { width: "initial" } : { width: "40px" }}
          onClick={() => setExpanded(true)}
        >
          <MagnifierIcon size={20} />
        </motion.button>
        {expanded && (
          <input
            placeholder="Поиск по названию или оборудованию"
            className="h-full w-full overflow-ellipsis outline-none"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          ></input>
        )}
      </motion.div>

      {expanded && (
        <button
          className="flex items-center justify-center px-2"
          onClick={() => {
            setExpanded(false);
            setSearchQuery("");
          }}
        >
          Отмена
        </button>
      )}
    </div>
  );
};
