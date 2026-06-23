interface ILogoProps {
  width?: number;
  height?: number;
}
export const Logo = (props: ILogoProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      shape-rendering="geometricPrecision"
      {...props}>
      <rect width="64" height="64" rx="12" fill="#06b6d4" />
      <rect x="16" y="16" width="13" height="13" fill="#0a0a0a" />
      <rect x="16" y="40" width="32" height="7" fill="#0a0a0a" />
    </svg>
  );
};
