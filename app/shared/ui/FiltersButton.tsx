import { cn } from "~/shared/lib/utils";
import { FiltersIcon } from "./icons";
import { pluralize } from "../lib/pluralize";

interface FiltersButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activeFilters?: number;
}

export const FiltersButton = ({
  activeFilters,
  className,
  ...props
}: FiltersButtonProps) => {
  return (
    <button
      className={cn(
        "bg-muted active:bg-muted/80 flex h-[35px] items-center gap-1.5 rounded-full px-3 transition-colors",
        {
          "text-background-100 bg-white active:bg-white/80":
            activeFilters && activeFilters > 0,
        },
        className,
      )}
      {...props}
    >
      <FiltersIcon size={12} />
      <span className="text-xs font-medium">
        {activeFilters && activeFilters > 0
          ? pluralize(activeFilters, ["фильтр", "фильтра", "фильтров"])
          : "Фильтры"}
      </span>
    </button>
  );
};
