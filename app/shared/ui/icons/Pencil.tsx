import { fillPrimary, type IconProps } from ".";

const PencilIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.95643 24.1991L22.0639 10.0974L19.6542 7.67738L5.53643 21.7893L4.31425 24.7304C4.17639 25.104 4.5626 25.5054 4.92044 25.3617L7.95643 24.1991ZM23.266 8.91588L24.6245 7.58021C25.2987 6.90596 25.3261 6.15889 24.7181 5.53838L24.2279 5.04595C23.62 4.43574 22.8684 4.50077 22.1919 5.15217L20.8357 6.49589L23.266 8.91588Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

PencilIcon.displayName = "PencilIcon";

export { PencilIcon };
