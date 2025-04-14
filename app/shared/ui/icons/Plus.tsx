import { fillPrimary, type IconProps } from ".";

const PlusIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.07129 9.37603C3.07129 9.8387 3.45338 10.216 3.91127 10.216H8.53729V14.842C8.53729 15.2986 8.9132 15.6807 9.37591 15.6807C9.83858 15.6807 10.222 15.2986 10.222 14.842V10.216H14.8419C15.2984 10.216 15.6805 9.8387 15.6805 9.37603C15.6805 8.91332 15.2984 8.52987 14.8419 8.52987H10.222V3.91139C10.222 3.45351 9.83858 3.07141 9.37591 3.07141C8.9132 3.07141 8.53729 3.45351 8.53729 3.91139V8.52987H3.91127C3.45338 8.52987 3.07129 8.91332 3.07129 9.37603Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

PlusIcon.displayName = "PlusIcon";

export { PlusIcon };
