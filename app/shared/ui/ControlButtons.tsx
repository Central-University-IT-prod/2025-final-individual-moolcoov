import React from "react";
import { Button } from "./Button";
import { ArrowLeftIcon } from "./icons";

interface ControlButtonsProps {
  withBackButton?: boolean;
  disabled?: boolean;
  label: string;

  onNext: () => void;
  onBack?: () => void;
}

export const ControlButtons = ({
  withBackButton,
  disabled,
  label,
  onNext,
  onBack,
}: ControlButtonsProps) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <div className="m-auto flex w-full justify-center gap-2 lg:max-w-xl">
      {withBackButton && (
        <button
          className="bg-muted flex h-14 w-full max-w-14 items-center justify-center rounded-full transition-transform active:scale-[0.95]"
          onClick={onBack}
        >
          <ArrowLeftIcon size={28} />
        </button>
      )}
      <Button
        disabled={disabled || pressed}
        onClick={() => {
          setPressed(true);
          onNext();
        }}
      >
        {label}
      </Button>
    </div>
  );
};
