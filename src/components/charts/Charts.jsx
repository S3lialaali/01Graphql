export function XPChart({ data }) {
  const W = 900, H = 420, PX = 6, PY = 20;

  const t0  = data[0].date;
  const t1  = data[data.length - 1].date;
  const max = data[data.length - 1].total;
  const dt  = t1 - t0 || 1;

  const toX = (t) => PX + ((t - t0) / dt) * (W - 2 * PX);
  const toY = (v) => PY + (1 - v / max)   * (H - 2 * PY);

  const step    = Math.max(1, Math.floor(data.length / 250));
  const sampled = data.filter((_, i) => i % step === 0 || i === data.length - 1);
  const pts     = sampled.map((p) => `${toX(p.date).toFixed(1)},${toY(p.total).toFixed(1)}`);
  const base    = H - PY;
  const areaPts = [
    `${toX(sampled[0].date).toFixed(1)},${base}`,
    ...pts,
    `${toX(sampled[sampled.length - 1].date).toFixed(1)},${base}`,
  ].join(" ");

  const lastX = toX(data[data.length - 1].date);
  const lastY = toY(data[data.length - 1].total);
  const ticks = [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]];

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" preserveAspectRatio="xMidYMid meet" fill="none">
      {[0.33, 0.66, 1].map((s) => (
        <line key={s} x1={PX} y1={toY(max * s)} x2={W - PX} y2={toY(max * s)}
          stroke="rgb(var(--ink))" strokeWidth="0.4" opacity="0.12" strokeDasharray="5 4" />
      ))}
      <polygon points={areaPts} fill="rgb(var(--accent))" fillOpacity="0.14" />
      <polyline points={pts.join(" ")} fill="none" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinejoin="round" />
      <circle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r="4.5" fill="rgb(var(--accent))" />
      <line x1={PX} y1={base} x2={W - PX} y2={base} stroke="rgb(var(--ink))" strokeWidth="0.4" opacity="0.18" />
      {ticks.map((p, i) => {
        const x      = toX(p.date);
        const label  = new Date(p.date).toLocaleDateString("en", { month: "short", year: "2-digit" });
        const anchor = i === 0 ? "start" : i === 2 ? "end" : "middle";
        return (
          <text key={i} x={x.toFixed(1)} y={H + 18} textAnchor={anchor}
            fontSize="9.5" fill="rgb(var(--ink))" fillOpacity="0.38"
            fontFamily="system-ui, sans-serif" fontWeight="600">
            {label}
          </text>
        );
      })}
    </svg>
  );
}

export function RadarChart({ skills, size = 240, label }) {
  if (!skills || skills.length < 3) return null;

  const pad  = 30;
  const cx   = size / 2 + pad;
  const cy   = size / 2 + pad;
  const r    = size * 0.38;
  const n    = skills.length;
  const svgW = size + pad * 2;
  const svgH = size + pad * 2 + 20;

  const angle  = (i) => (2 * Math.PI * i) / n - Math.PI / 2;
  const pt     = (i, val) => {
    const a  = angle(i);
    const rv = (val / 100) * r;
    return { x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) };
  };
  const toPoly = (pts) => pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const outerPts = skills.map((_, i) => pt(i, 100));
  const valuePts = skills.map((s, i) => pt(i, s.amount));

  return (
    <div className="flex flex-col items-center">
      {label && (
        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/35 mb-4">{label}</p>
      )}
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" fill="none">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <circle key={scale} cx={cx.toFixed(1)} cy={cy.toFixed(1)} r={(r * scale).toFixed(1)}
            fill="none" stroke="rgb(var(--ink))"
            strokeWidth={scale === 1 ? 0.8 : 0.4} opacity={scale === 1 ? 0.18 : 0.09} />
        ))}
        {outerPts.map((p, i) => (
          <line key={i} x1={cx.toFixed(1)} y1={cy.toFixed(1)}
            x2={p.x.toFixed(1)} y2={p.y.toFixed(1)}
            stroke="rgb(var(--ink))" strokeWidth="0.5" opacity="0.13" />
        ))}
        <polygon points={toPoly(valuePts)}
          fill="rgb(var(--accent))" fillOpacity="0.22"
          stroke="rgb(var(--accent))" strokeWidth="1.8" strokeLinejoin="round" />
        {valuePts.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill="rgb(var(--accent))" />
        ))}
        {outerPts.map((_, i) => {
          const a      = angle(i);
          const lx     = cx + (r + 20) * Math.cos(a);
          const ly     = cy + (r + 20) * Math.sin(a);
          const anchor = Math.abs(lx - cx) < 6 ? "middle" : lx < cx ? "end" : "start";
          return (
            <text key={i} x={lx.toFixed(1)} y={(ly + 1).toFixed(1)}
              textAnchor={anchor} dominantBaseline="middle"
              fontSize="9.5" fill="rgb(var(--ink))" fillOpacity="0.62"
              fontFamily="system-ui, sans-serif" fontWeight="700">
              {skills[i].name.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
