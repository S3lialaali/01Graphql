import { useEffect } from "react";
import { useInView } from "../hooks/useInView";

export default function Section({ id, title, subtitle, onEnter, children }) {
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && onEnter) onEnter();
  }, [inView, onEnter]);

  return (
    <section
      id={id}
      ref={ref}
      className="scroll-mt-24 py-12 border-b border-white/5"
    >
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}