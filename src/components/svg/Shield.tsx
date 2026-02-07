/** Forme de l'écu français - viewBox 600×720 */
export default function Shield({ children }: { children?: React.ReactNode }) {
  return (
    <svg viewBox="0 0 600 720" width="100%" height="100%" style={{ maxWidth: 360, maxHeight: 432 }}>
      <defs>
        <clipPath id="ecu-clip">
          <path d="M 0,0 L 600,0 L 600,518.4 Q 600,633.6 300,720 Q 0,633.6 0,518.4 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#ecu-clip)">
        {children}
      </g>
      {/* Contour de l'écu */}
      <path
        d="M 0,0 L 600,0 L 600,518.4 Q 600,633.6 300,720 Q 0,633.6 0,518.4 Z"
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="4"
      />
    </svg>
  );
}
