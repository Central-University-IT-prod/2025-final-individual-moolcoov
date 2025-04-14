import { cn } from "../lib/utils";

export const InfoColumn = ({
  info,
  label,
  className,
}: {
  info: React.ReactNode;
  label: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col items-center justify-between gap-2",
        className,
      )}
    >
      {info}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
