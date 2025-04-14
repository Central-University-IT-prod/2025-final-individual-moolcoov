import { fillPrimary, type IconProps } from ".";

const PersonIcon = ({ size = 30, ...props }: IconProps) => {
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
        d="M6.10515 24.5752H21.6977C23.0148 24.5752 23.8007 23.9512 23.8007 22.9153C23.8007 19.9003 19.9776 15.7537 13.8955 15.7537C7.82523 15.7537 4 19.9003 4 22.9153C4 23.9512 4.78797 24.5752 6.10515 24.5752ZM13.9052 13.673C16.4594 13.673 18.6327 11.4019 18.6327 8.46585C18.6327 5.58397 16.453 3.39093 13.9052 3.39093C11.3573 3.39093 9.17547 5.62452 9.17969 8.48718C9.1818 11.4019 11.3434 13.673 13.9052 13.673Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

PersonIcon.displayName = "PersonIcon";

export { PersonIcon };
