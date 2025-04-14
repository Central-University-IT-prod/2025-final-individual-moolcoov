import type { JSX } from "react";
import { cn } from "../lib/utils";
import { CheckIcon } from "./icons";

interface CheckboxProps {
  icon?: React.ReactNode | JSX.Element;
  label: React.ReactNode;
  checked?: boolean;
  onChange: () => void;
}

export const Checkbox = ({ icon, label, checked, onChange }: CheckboxProps) => {
  return (
    <div
      className="flex h-13 items-center justify-between"
      role="button"
      onClick={onChange}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>

      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border",
          {
            "bg-white": checked,
          },
        )}
      >
        {checked && <CheckIcon size={16} className="text-background-200" />}
      </div>
    </div>
  );
};
