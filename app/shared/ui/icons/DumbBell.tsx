import { fillPrimary, type IconProps } from ".";

const DumbBellIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.79484 20.2686C2.81577 20.2686 3.59929 19.4851 3.59929 18.4876V9.50163C3.59929 8.4903 2.81577 7.69929 1.79484 7.69929C0.785623 7.69929 0 8.4903 0 9.50163V18.4876C0 19.4851 0.785623 20.2686 1.79484 20.2686ZM7.68186 22.9892C9.36701 22.9892 10.5286 21.8386 10.5286 20.2144V7.78647C10.5286 6.15265 9.36701 5 7.68186 5C6.00421 5 4.84476 6.15265 4.84476 7.78647V20.2144C4.84476 21.8386 6.00421 22.9892 7.68186 22.9892ZM11.8626 16.4293H19.2581V11.5599H11.8626V16.4293ZM23.4368 22.9892C25.1261 22.9892 26.2856 21.8386 26.2856 20.2144V7.78647C26.2856 6.15265 25.1261 5 23.4368 5C21.7612 5 20.6018 6.15265 20.6018 7.78647V20.2144C20.6018 21.8386 21.7612 22.9892 23.4368 22.9892ZM29.2256 20.2686C30.2369 20.2686 31.0321 19.4851 31.0321 18.4876V9.50163C31.0321 8.4903 30.2369 7.69929 29.2256 7.69929C28.2164 7.69929 27.4328 8.4903 27.4328 9.50163V18.4876C27.4328 19.4851 28.2164 20.2686 29.2256 20.2686Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

DumbBellIcon.displayName = "DumbBellIcon";

const DumbBellColoredIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        width="8.46745"
        height="2.99031"
        transform="matrix(0.865765 -0.500451 0.499549 0.866285 11.6787 16.483)"
        fill="#BDC9CC"
      />
      <g clipPath="url(#clip0_60983_3529)">
        <rect
          width="4.98085"
          height="11.9612"
          rx="2.49043"
          transform="matrix(-0.865765 0.500451 0.499549 0.866285 24.7798 4.30469)"
          fill="#1DB2F2"
        />
        <rect
          width="1.99234"
          height="3.48869"
          rx="0.99617"
          transform="matrix(-0.865765 0.500451 0.499549 0.866285 23.9839 5.91595)"
          fill="#59E3FB"
        />
      </g>
      <g clipPath="url(#clip1_60983_3529)">
        <rect
          width="5.97702"
          height="17.4434"
          rx="2.98851"
          transform="matrix(-0.865765 0.500451 0.499549 0.866285 19.4053 3.95764)"
          fill="#1DB2F2"
        />
        <rect
          width="2.98851"
          height="4.98384"
          rx="1.49426"
          transform="matrix(-0.865765 0.500451 0.499549 0.866285 18.8584 6.00067)"
          fill="#59E3FB"
        />
      </g>
      <g clipPath="url(#clip2_60983_3529)">
        <rect
          width="4.98085"
          height="11.9612"
          rx="2.49043"
          transform="matrix(0.865765 -0.500451 0.499549 0.866285 1.49365 17.7651)"
          fill="#1DB2F2"
        />
        <rect
          width="1.99234"
          height="3.48869"
          rx="0.99617"
          transform="matrix(0.865765 -0.500451 0.499549 0.866285 3.28516 17.8808)"
          fill="#59E3FB"
        />
      </g>
      <g clipPath="url(#clip3_60983_3529)">
        <rect
          width="5.97702"
          height="17.4434"
          rx="2.98851"
          transform="matrix(0.865765 -0.500451 0.499549 0.866285 3.88086 12.9313)"
          fill="#1DB2F2"
        />
        <rect
          width="2.98851"
          height="4.98384"
          rx="1.49426"
          transform="matrix(0.865765 -0.500451 0.499549 0.866285 5.92139 13.4787)"
          fill="#59E3FB"
        />
      </g>
      <defs>
        <clipPath id="clip0_60983_3529">
          <rect
            width="4.98085"
            height="11.9612"
            rx="2.49043"
            transform="matrix(-0.865765 0.500451 0.499549 0.866285 24.7798 4.30469)"
            fill="white"
          />
        </clipPath>
        <clipPath id="clip1_60983_3529">
          <rect
            width="5.97702"
            height="17.4434"
            rx="2.98851"
            transform="matrix(-0.865765 0.500451 0.499549 0.866285 19.4053 3.95764)"
            fill="white"
          />
        </clipPath>
        <clipPath id="clip2_60983_3529">
          <rect
            width="4.98085"
            height="11.9612"
            rx="2.49043"
            transform="matrix(0.865765 -0.500451 0.499549 0.866285 1.49365 17.7651)"
            fill="white"
          />
        </clipPath>
        <clipPath id="clip3_60983_3529">
          <rect
            width="5.97702"
            height="17.4434"
            rx="2.98851"
            transform="matrix(0.865765 -0.500451 0.499549 0.866285 3.88086 12.9313)"
            fill="white"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

DumbBellColoredIcon.displayName = "DumbBellColoredIcon";

export { DumbBellColoredIcon, DumbBellIcon };
