import { useScroll, useTransform, motion } from "framer-motion";

/*
 * ONE continuous path — flower (y 0-50) + winding S-curve trail (y 50-600)
 * viewBox "0 0 100 600" + preserveAspectRatio="none"
 * x 0-100 maps to full page width; y 0-600 maps to total page height (~6×100vh)
 * Stroke visible in left (x≈5-18) and right (x≈82-95) margins,
 * hidden behind centered content boxes (bg-canvas z-10).
 */
const PATH =
  /* center (50,28) */
  "M 50,28 " +
  /* petal 1 – up */
  "C 56,22 56,10 50,10 C 44,10 44,22 50,28 " +
  /* petal 2 – upper-right */
  "C 57,24 66,14 66,19 C 66,24 57,30 50,28 " +
  /* petal 3 – lower-right */
  "C 58,33 67,41 64,44 C 61,47 53,37 50,28 " +
  /* petal 4 – down */
  "C 56,34 56,46 50,46 C 44,46 44,34 50,28 " +
  /* petal 5 – lower-left */
  "C 42,33 33,41 36,44 C 39,47 47,37 50,28 " +
  /* petal 6 – upper-left */
  "C 43,24 34,14 34,19 C 34,24 43,30 50,28 " +
  /* inner accent loop */
  "C 53,26 57,29 54,32 C 51,35 47,32 50,28 " +
  /* exit toward trail */
  "C 50,37 51,45 53,52 " +

  /* ── welcome exit (y 52-100) ── */
  "C 63,62 84,74 88,88 " +
  "C 92,100 86,113 75,119 " +

  /* ── section 1 – You (y 100-200) ── */
  "C 60,126 30,134 14,147 " +
  "C 4,158 6,174 20,183 " +
  "C 40,193 74,196 88,208 " +
  "C 97,218 96,234 83,242 " +

  /* ── section 2 – Audit (y 200-300) ── */
  "C 66,250 28,256 13,268 " +
  "C 3,278 7,295 23,303 " +
  "C 48,312 80,314 92,326 " +
  "C 99,337 96,354 80,361 " +

  /* ── section 3 – XP (y 300-400) ── */
  "C 60,369 24,376 11,389 " +
  "C 2,402 8,419 26,427 " +
  "C 52,435 84,437 94,449 " +
  "C 99,460 95,477 78,484 " +

  /* ── section 4 – Projects (y 400-500) ── */
  "C 58,492 20,498 9,511 " +
  "C 2,524 9,542 29,550 " +
  "C 57,558 87,559 95,571 " +
  "C 99,583 94,599 75,605 " +

  /* ── section 5 – Skills (y 500-600) ── */
  "C 54,612 20,618 9,630 " +
  "C 2,642 10,659 32,667 " +
  "C 60,675 90,675 97,688";

/*
 * Flower occupies roughly the first 17% of path length.
 * pathLength [0.17, 1] pre-fills the flower and animates
 * only the trail as the user scrolls.
 */
export default function ScrollStroke() {
  const { scrollYProgress } = useScroll();
  const pathLength = useTransform(scrollYProgress, [0, 1], [0.17, 0.85]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
      <svg
        viewBox="0 0 100 600"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* faint ghost trace */}
        <path
          d={PATH}
          stroke="rgb(var(--accent))"
          strokeWidth="0.8"
          opacity="0.18"
          strokeLinecap="round"
        />
        {/* scroll-driven reveal */}
        <motion.path
          d={PATH}
          stroke="rgb(var(--accent))"
          strokeWidth="0.8"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}
