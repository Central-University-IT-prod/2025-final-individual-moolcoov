import { fillPrimary, type IconProps } from ".";

const MagnifierIcon = ({ size = 30, ...props }: IconProps) => {
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
        d="M1.05884 7.37021C1.05884 10.8536 3.88958 13.683 7.3716 13.683C8.66655 13.683 9.85495 13.285 10.8457 12.6132L14.4086 16.1824C14.6316 16.4055 14.927 16.5117 15.238 16.5117C15.898 16.5117 16.37 16.0129 16.37 15.3607C16.37 15.0539 16.2573 14.7676 16.0442 14.5545L12.5088 10.9987C13.249 9.98042 13.6844 8.72856 13.6844 7.37021C13.6844 3.88819 10.8536 1.05884 7.3716 1.05884C3.88958 1.05884 1.05884 3.88819 1.05884 7.37021ZM2.7032 7.37021C2.7032 4.79444 4.79584 2.7032 7.3716 2.7032C9.9474 2.7032 12.0386 4.79444 12.0386 7.37021C12.0386 9.9474 9.9474 12.0386 7.3716 12.0386C4.79584 12.0386 2.7032 9.9474 2.7032 7.37021Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

MagnifierIcon.displayName = "MagnifierIcon";

export { MagnifierIcon };
