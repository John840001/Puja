import { useMemo } from "react";

export default function AmbientBackground() {
  const shapes = useMemo(() => {
    const glyphs = ["♥", "✦", "☆", "♡"];
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      glyph: glyphs[i % glyphs.length],
      left: Math.random() * 100,
      size: 12 + Math.random() * 16,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 10,
      color: i % 2 === 0 ? "#f5abc9" : "#c98fd6",
    }));
  }, []);

  return (
    <div className="ambient">
      {shapes.map((s) => (
        <span
          key={s.id}
          style={{
            left: s.left + "%",
            fontSize: s.size,
            color: s.color,
            animationDuration: s.duration + "s",
            animationDelay: s.delay + "s",
          }}
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}
