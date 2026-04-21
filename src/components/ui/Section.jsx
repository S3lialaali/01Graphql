import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export function useSectionActive(ref) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0, rootMargin: "200px 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return active;
}

export function Section({ children, maxWidth = "max-w-3xl" }) {
  const containerRef = useRef(null);
  const active = useSectionActive(containerRef);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.35], [35, 0]);
  const scale   = useTransform(scrollYProgress, [0, 0.35], [0.82, 1]);

  return (
    <div
      ref={containerRef}
      className="min-h-[140vh] flex items-center justify-center px-4 py-32"
      style={{ perspective: "800px" }}
    >
      <motion.div
        className={`relative z-10 bg-canvas/50 backdrop-blur-md w-full ${maxWidth} px-6 lg:px-10 py-20`}
        style={{ rotateX, scale }}
      >
        {children(active)}
      </motion.div>
    </div>
  );
}
