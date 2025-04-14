import { MagnifierIcon, XmarkIcon } from "./icons";
import { cn } from "../lib/utils";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  className?: string;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  className,
}: SearchBarProps) => {
  return (
    <div className={cn("flex w-full gap-3", className)}>
      <div className="bg-muted flex h-14 w-full items-center gap-3 overflow-hidden rounded-full px-4">
        <div className="flex h-12 items-center justify-center">
          <MagnifierIcon size={20} />
        </div>

        <input
          placeholder="Поиск по названию или оборудованию"
          className="h-full w-full overflow-ellipsis outline-none"
          autoFocus
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>

        {searchQuery != "" && (
          <button
            className="text-muted-foreground"
            onClick={() => setSearchQuery("")}
          >
            <XmarkIcon size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
