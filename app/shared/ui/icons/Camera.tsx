import { fillPrimary, type IconProps } from ".";

const CameraIcon = ({ size = 30, ...props }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 42 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.49173 35.1832H35.8834C39.4861 35.1832 41.3783 33.3186 41.3783 29.7463V12.1793C41.3783 8.60706 39.4861 6.75618 35.8834 6.75618H31.3999C30.0864 6.75618 29.6604 6.51845 28.8559 5.67236L27.5317 4.23798C26.6614 3.32325 25.7836 2.85718 24.0803 2.85718H17.2017C15.4986 2.85718 14.6207 3.32325 13.7504 4.23798L12.4232 5.67236C11.6186 6.50472 11.182 6.75618 9.87924 6.75618H5.49173C1.87834 6.75618 0 8.60706 0 12.1793V29.7463C0 33.3186 1.87834 35.1832 5.49173 35.1832ZM20.6876 29.9553C15.6723 29.9553 11.6434 25.94 11.6434 20.8913C11.6434 15.8563 15.6723 11.8441 20.6876 11.8441C25.7089 11.8441 29.7211 15.8563 29.7211 20.8913C29.7211 25.94 25.6951 29.9553 20.6876 29.9553ZM20.6876 26.9646C24.0419 26.9646 26.7441 24.27 26.7441 20.8913C26.7441 17.5233 24.0419 14.821 20.6876 14.821C17.3394 14.821 14.6203 17.5233 14.6203 20.8913C14.6203 24.27 17.3531 26.9646 20.6876 26.9646ZM30.8036 14.7396C30.8036 13.5591 31.8381 12.5245 33.0493 12.5245C34.2436 12.5245 35.2614 13.5591 35.2614 14.7396C35.2614 15.9674 34.2466 16.9488 33.0493 16.9655C31.8321 16.9685 30.8036 15.9812 30.8036 14.7396Z"
        fill={fillPrimary}
      />
    </svg>
  );
};

CameraIcon.displayName = "CameraIcon";

export { CameraIcon };
