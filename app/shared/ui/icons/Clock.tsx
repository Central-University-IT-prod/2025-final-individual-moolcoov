import { type IconProps } from ".";

const ClockColoredIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 234 234"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_61160_2771)">
        <path
          d="M234 117C234 52.3827 181.617 0 117 0C52.3827 0 0 52.3827 0 117C0 181.617 52.3827 234 117 234C181.617 234 234 181.617 234 117Z"
          fill="#CB86FA"
        />
        <g filter="url(#filter0_d_61160_2771)">
          <path
            d="M203.478 117C203.478 69.2396 164.761 30.522 117 30.522C69.2396 30.522 30.522 69.2396 30.522 117C30.522 164.761 69.2396 203.478 117 203.478C164.761 203.478 203.478 164.761 203.478 117Z"
            fill="#E6C1FF"
          />
          <path
            d="M117 139.044C127.302 139.044 135.652 130.693 135.652 120.391C135.652 110.09 127.302 101.739 117 101.739C106.699 101.739 98.3481 110.09 98.3481 120.391C98.3481 130.693 106.699 139.044 117 139.044Z"
            fill="#9200F5"
          />
          <path
            d="M90.8514 72.3541C86.8815 67.9809 80.1179 67.6539 75.7447 71.6238C71.3714 75.5937 71.0444 82.3573 75.0144 86.7305L108.628 123.76C112.598 128.133 119.362 128.46 123.735 124.49C128.108 120.52 128.435 113.756 124.465 109.383L90.8514 72.3541Z"
            fill="#9200F5"
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_61160_2771"
          x="25.522"
          y="25.522"
          width="182.957"
          height="182.957"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.739469 0 0 0 0 0.356988 0 0 0 0 1 0 0 0 0.56 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_61160_2771"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_61160_2771"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_61160_2771">
          <rect width="234" height="234" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

ClockColoredIcon.displayName = "ClockColoredIcon";

export { ClockColoredIcon };
