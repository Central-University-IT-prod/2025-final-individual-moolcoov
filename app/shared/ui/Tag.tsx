import type { Tag } from "~/features/tag/model/types";

interface TagBadgeProps {
  dark?: boolean;
  tag: Tag;
}

export const TagBadge = ({ dark, tag }: TagBadgeProps) => {
  return (
    <div
      style={{ background: dark ? "rgba(0, 0, 0, 0.4)" : "var(--color-muted)" }}
      className="flex h-[27px] items-center rounded-md px-2.5 text-xs font-medium backdrop-blur-sm"
    >
      {tag.label}
    </div>
  );
};
