import { fillPrimary, type IconProps } from ".";

const FiltersIcon = ({ size = 30, ...props }: IconProps) => {
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
        d="M1.47901 8.62783C0.819823 8.62783 0.307129 8.11514 0.307129 7.45596C0.307129 6.79678 0.819823 6.26944 1.47901 6.26944H28.7691C29.4282 6.26944 29.9409 6.79678 29.9409 7.45596C29.9409 8.11514 29.4282 8.62783 28.7691 8.62783H1.47901ZM4.56982 16.1718C3.91065 16.1718 3.3833 15.6591 3.3833 14.9999C3.3833 14.3407 3.91065 13.8133 4.56982 13.8133H25.7661C26.4253 13.8133 26.938 14.3407 26.938 14.9999C26.938 15.6591 26.4253 16.1718 25.7661 16.1718H4.56982ZM7.57278 23.7158C6.91357 23.7158 6.40088 23.2031 6.40088 22.5439C6.40088 21.8847 6.91357 21.3573 7.57278 21.3573H22.7485C23.4077 21.3573 23.9351 21.8847 23.9351 22.5439C23.9351 23.2031 23.4077 23.7158 22.7485 23.7158H7.57278Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

FiltersIcon.displayName = "FiltersIcon";

export { FiltersIcon };
