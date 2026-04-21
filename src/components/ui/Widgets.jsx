export function Stat({ label, value }) {
  return (
    <div className="text-center py-4 border border-ink/10 rounded-xl">
      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/35 mb-1.5">
        {label}
      </p>
      <p className="text-base font-semibold leading-tight">{value}</p>
    </div>
  );
}

export function AuditBar({ label, value, pct, accent }) {
  function formatBytes(b) {
    if (!b) return "0 B";
    if (b >= 1_000_000) return (b / 1_000_000).toFixed(2) + " MB";
    if (b >= 1_000)     return (b / 1_000).toFixed(1) + " kB";
    return b + " B";
  }

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-ink/40">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">{formatBytes(value)}</span>
      </div>
      <div className="h-5 rounded-full overflow-hidden bg-ink/10">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: pct + "%", background: accent ? "rgb(var(--accent))" : "rgb(var(--ink) / 0.4)" }}
        />
      </div>
    </div>
  );
}
