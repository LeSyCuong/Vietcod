export const UnkeyLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="110"
      height="40"
      viewBox="0 0 110 40"
    >
      <defs>
        <radialGradient
          id="paint_vietcod_nav"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(55 20) rotate(23) scale(90)"
        >
          <stop offset="0.2" stopColor="white" />
          <stop offset="0.9" stopColor="white" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <text
        x="0"
        y="28"
        fontFamily="Inter, sans-serif"
        fontWeight="800"
        fontSize="26"
        fill="url(#paint_vietcod_nav)"
        style={{
          letterSpacing: "-0.04em",
          shapeRendering: "geometricPrecision",
        }}
      >
        Vietcod
      </text>
    </svg>
  );
};
