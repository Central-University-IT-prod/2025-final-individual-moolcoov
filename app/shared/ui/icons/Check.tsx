import { fillPrimary, type IconProps } from ".";

const CheckIcon = ({ size = 30, ...props }: IconProps) => {
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
        d="M11.9254 24.8903C12.5347 24.8903 13.0155 24.636 13.3494 24.1265L24.3646 6.95472C24.6114 6.56847 24.7103 6.24527 24.7103 5.92723C24.7103 5.12028 24.1429 4.56342 23.3275 4.56342C22.7491 4.56342 22.4132 4.75795 22.0623 5.30872L11.8785 21.4877L6.6306 14.74C6.28912 14.2877 5.93077 14.0983 5.42452 14.0983C4.58781 14.0983 4 14.684 4 15.493C4 15.8406 4.12984 16.1917 4.42211 16.5468L10.4936 24.1431C10.8979 24.6487 11.335 24.8903 11.9254 24.8903Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

CheckIcon.displayName = "CheckIcon";

export { CheckIcon };
