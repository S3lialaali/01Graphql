function Base({ children }) {
  return <div className="w-full animate-pulse text-center">{children}</div>;
}

export function YouSkeleton() {
  return (
    <Base>
      <div className="h-10 bg-ink/10 rounded-full w-48 mb-4 mx-auto" />
      <div className="h-5 bg-ink/10 rounded-full w-32 mb-16 mx-auto" />
      <div className="h-20 bg-ink/10 rounded-2xl w-52 mb-4 mx-auto" />
      <div className="h-5 bg-ink/10 rounded-full w-40 mb-16 mx-auto" />
      <div className="grid grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-ink/10 rounded-xl" />)}
      </div>
    </Base>
  );
}

export function AuditSkeleton() {
  return (
    <Base>
      <div className="h-5 bg-ink/10 rounded-full w-36 mb-3 mx-auto" />
      <div className="h-10 bg-ink/10 rounded-full w-56 mb-14 mx-auto" />
      <div className="h-28 bg-ink/10 rounded-2xl mb-10 mx-auto w-40" />
      <div className="space-y-6">
        <div className="h-8 bg-ink/10 rounded-xl" />
        <div className="h-8 bg-ink/10 rounded-xl" />
      </div>
    </Base>
  );
}

export function XPSkeleton() {
  return (
    <Base>
      <div className="h-5 bg-ink/10 rounded-full w-28 mb-3 mx-auto" />
      <div className="h-10 bg-ink/10 rounded-full w-52 mb-14 mx-auto" />
      <div className="h-24 bg-ink/10 rounded-2xl w-64 mb-4 mx-auto" />
      <div className="h-4 bg-ink/10 rounded-full w-40 mb-16 mx-auto" />
      <div className="h-44 bg-ink/10 rounded-2xl" />
    </Base>
  );
}

export function ProjectsSkeleton() {
  const ws = [88, 72, 60, 50, 40];
  return (
    <Base>
      <div className="h-5 bg-ink/10 rounded-full w-32 mb-3 mx-auto" />
      <div className="h-10 bg-ink/10 rounded-full w-52 mb-14 mx-auto" />
      <div className="space-y-7">
        {ws.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-2.5 bg-ink/10 rounded-full w-24 shrink-0" />
            <div className="h-2 bg-ink/10 rounded-full flex-1" style={{ maxWidth: w + "%" }} />
          </div>
        ))}
      </div>
    </Base>
  );
}

export function SkillsSkeleton() {
  return (
    <Base>
      <div className="h-5 bg-ink/10 rounded-full w-28 mb-3 mx-auto" />
      <div className="h-10 bg-ink/10 rounded-full w-72 mb-14 mx-auto" />
      <div className="grid grid-cols-2 gap-8">
        <div className="h-64 bg-ink/10 rounded-3xl" />
        <div className="h-64 bg-ink/10 rounded-3xl" />
      </div>
    </Base>
  );
}
