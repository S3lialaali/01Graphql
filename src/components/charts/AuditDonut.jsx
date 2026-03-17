export default function AuditDonut({ up, down, size = 160, stroke = 18 }) {
  const total = up + down;
  const upRatio = total > 0 ? up / total : 0;
  const downRatio = total > 0 ? down / total : 0;

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const upLen = c * upRatio;
  const downLen = c * downRatio;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={stroke}
      />

      {/* Up arc (starts at 12 o’clock) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(34,197,94,0.9)"          /* green-ish */
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${upLen} ${c - upLen}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Down arc (starts where Up ends) */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(239,68,68,0.9)"          /* red-ish */
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${downLen} ${c - downLen}`}
        strokeDashoffset={-upLen}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      {/* Center text: Up / Down values */}
      <text
        x="50%"
        y="46%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="12"
        fill="rgba(255,255,255,0.55)"
      >
        Up / Down
      </text>
      <text
        x="50%"
        y="58%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="14"
        fill="rgba(255,255,255,0.92)"
      >
        {up.toLocaleString()} / {down.toLocaleString()}
      </text>
    </svg>
  );
}