export default function StatCard({ label, value, subvalue }) {
  return (
    <div className="rounded-xl bg-zinc-950/40 p-4 ring-1 ring-white/10">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-lg">{value}</p>
      {subvalue ? <p className="text-sm text-zinc-400">{subvalue}</p> : null}
    </div>
  );
}