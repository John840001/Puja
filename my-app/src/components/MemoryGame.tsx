import { useState, useEffect } from "react";
import { MEMORY_ICONS } from "../data";

interface Tile {
  icon: string;
  id: number;
  matched: boolean;
}

export default function MemoryGame() {
  const buildDeck = (): Tile[] => {
    const pairs = [...MEMORY_ICONS, ...MEMORY_ICONS]
      .map((icon, i) => ({ icon, id: i, matched: false }))
      .sort(() => Math.random() - 0.5);
    return pairs;
  };

  const [deck, setDeck] = useState<Tile[]>(buildDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (open.length === 2) {
      const [a, b] = open;
      setMoves((m) => m + 1);
      if (deck[a].icon === deck[b].icon) {
        setTimeout(() => {
          setDeck((d) => d.map((t, i) => (i === a || i === b ? { ...t, matched: true } : t)));
          setOpen([]);
        }, 400);
      } else {
        setTimeout(() => setOpen([]), 700);
      }
    }
  }, [open]);

  useEffect(() => {
    if (deck.every((t) => t.matched)) setWon(true);
  }, [deck]);

  const handleFlip = (i: number) => {
    if (open.length === 2 || open.includes(i) || deck[i].matched) return;
    setOpen((o) => [...o, i]);
  };

  const reset = () => {
    setDeck(buildDeck());
    setOpen([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="panel">
      <h2>Memory Match</h2>
      <div className="desc">Find every pair. {moves} moves so far.</div>
      <div className="mem-grid">
        {deck.map((t, i) => {
          const visible = open.includes(i) || t.matched;
          return (
            <div
              key={t.id}
              className={"mem-tile" + (visible ? (t.matched ? " matched" : " open") : "")}
              onClick={() => handleFlip(i)}
            >
              {visible ? t.icon : ""}
            </div>
          );
        })}
      </div>
      <div className="mem-status">{won ? "You matched them all 🎉" : "\u00A0"}</div>
      {won && (
        <button className="spin-btn" style={{ display: "block", margin: "12px auto 0" }} onClick={reset}>
          Play again
        </button>
      )}
    </div>
  );
}
