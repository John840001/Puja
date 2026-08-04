import { useState } from "react";
import type { MouseEvent } from "react";
import { NAMES, LETTER_TEXT } from "../data";

interface Burst {
  id: number;
  x: number;
  y: number;
}

export default function LetterScreen() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const handleYes = (e: MouseEvent<HTMLButtonElement>) => {
    const id = Date.now();
    const x = e.clientX;
    const y = e.clientY;
    setBursts((b) => [...b, { id, x, y }]);
    setTimeout(() => setBursts((b) => b.filter((item) => item.id !== id)), 1100);
  };

  return (
    <div className="panel">
      <h2>For {NAMES.her}</h2>
      <div className="desc">Read all the way to the end.</div>
      <div className="letter">
        {LETTER_TEXT}
        <div className="sign">— {NAMES.him}</div>
      </div>
      <button className="yes-btn" onClick={handleYes}>
        Still choosing you 💜
      </button>
      {bursts.map((b) => (
        <span key={b.id} className="heart-burst" style={{ left: b.x - 10, top: b.y - 10 }}>
          💕
        </span>
      ))}
    </div>
  );
}
