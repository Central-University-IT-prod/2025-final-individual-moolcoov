import { fillPrimary, type IconProps } from ".";

const MinusIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.29608 15.6442H22.2993C22.9947 15.6442 23.5954 15.0435 23.5954 14.328C23.5954 13.6124 22.9947 13.0234 22.2993 13.0234H5.29608C4.61335 13.0234 4 13.6124 4 14.328C4 15.0435 4.61335 15.6442 5.29608 15.6442Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

MinusIcon.displayName = "MinusIcon";

export { MinusIcon };
