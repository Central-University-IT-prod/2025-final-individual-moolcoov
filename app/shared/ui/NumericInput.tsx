import NumberFlow from "@number-flow/react";
import clsx from "clsx/lite";
import * as React from "react";
import { PlusIcon } from "./icons";
import { MinusIcon } from "./icons/Minus";
type Props = {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
};
export default function Input({
  value = 0,
  min = -Infinity,
  max = Infinity,
  onChange,
}: Props) {
  const defaultValue = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [animated, setAnimated] = React.useState(true);
  const [showCaret, setShowCaret] = React.useState(true);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    setAnimated(false);
    let next = value;
    if (el.value === "") {
      next = defaultValue.current;
    } else {
      const num = parseInt(el.value);
      if (!isNaN(num) && min <= num && num <= max) next = num;
    }
    el.value = String(next);
    onChange?.(next);
  };

  const handlePointerDown =
    (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      setAnimated(true);
      if (event.pointerType === "mouse") {
        event?.preventDefault();
        inputRef.current?.focus();
      }
      const newVal = Math.min(Math.max(value + diff, min), max);
      onChange?.(newVal);
    };

  return (
    <div className="flex items-center gap-4 rounded-md text-4xl font-bold">
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="bg-muted flex h-[50px] w-[50px] items-center justify-center rounded-full transition-transform active:scale-[0.95]"
        disabled={min != null && value <= min}
        onPointerDown={handlePointerDown(-1)}
      >
        <MinusIcon size={18} />
      </button>
      <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
        <input
          ref={inputRef}
          className={clsx(
            showCaret ? "caret-accent" : "caret-transparent",
            "spin-hide w-[2em] bg-transparent py-2 text-center font-[inherit] text-transparent outline-none",
          )}
          style={{ fontKerning: "none" }}
          type="number"
          min={min}
          step={1}
          autoComplete="off"
          inputMode="numeric"
          max={max}
          value={value}
          onInput={handleInput}
        />
        <NumberFlow
          value={value}
          locales="en-US"
          format={{ useGrouping: false }}
          aria-hidden="true"
          animated={animated}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className="pointer-events-none"
          willChange
        />
      </div>
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="bg-muted flex h-[50px] w-[50px] items-center justify-center rounded-full transition-transform active:scale-[0.95]"
        disabled={max != null && value >= max}
        onPointerDown={handlePointerDown(1)}
      >
        <PlusIcon size={20} />
      </button>
    </div>
  );
}
