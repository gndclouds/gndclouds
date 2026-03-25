"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import styles from "./design-background-lab.module.css";

const ASCII_CHARS = "·˙·░▒░ :;·+*";

function buildAsciiTile(cols: number, rows: number): string {
  let out = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out += ASCII_CHARS[(r * 17 + c * 11) % ASCII_CHARS.length] ?? "·";
    }
    out += "\n";
  }
  return out;
}

export function DesignBackgroundLab() {
  const rootRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const asciiBlock = useMemo(() => buildAsciiTile(140, 72), []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = (e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      target.current = { x: nx, y: ny };
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const t = target.current;
      const c = current.current;
      const ease = 0.08;
      c.x += (t.x - c.x) * ease;
      c.y += (t.y - c.y) * ease;

      const px = c.x * 36;
      const py = c.y * 28;

      el.style.setProperty("--px", `${px}px`);
      el.style.setProperty("--py", `${py}px`);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const rootStyle = {
    "--design-mesh-opacity": "0.94",
    "--design-mesh-opacity-dark": "0.82",
  } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      aria-hidden
      style={rootStyle}
    >
      <div className={styles.base} />
      <div className={styles.asciiWrap}>
        <pre className={styles.ascii}>{asciiBlock}</pre>
      </div>
      <div className={styles.meshBlur}>
        <div className={styles.meshInner}>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
          <div className={styles.orb4} />
        </div>
      </div>
      <div className={styles.vignette} />
    </div>
  );
}
