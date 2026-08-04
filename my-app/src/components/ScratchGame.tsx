import { useRef, useState, useEffect } from "react";
import type { MouseEvent, TouchEvent } from "react";
import { SCRATCH_NOTE } from "../data";

export default function ScratchGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const holder = holderRef.current;
    if (!canvas || !holder) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const w = holder.clientWidth;
      // Cap the card's height to a share of the viewport so it never
      // forces extra scrolling on a short landscape phone screen.
      const h = Math.max(140, Math.min(220, window.innerHeight * 0.32));
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = "#c98fd6";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.font = "600 15px Quicksand";
      ctx.textAlign = "center";
      ctx.fillText("Scratch here ✦", w / 2, h / 2);
    };

    // Re-measure on resize and on orientation change. Rotating the phone
    // resets the scratch progress since the canvas has to be redrawn at
    // its new size, so also reset the "revealed" state to match.
    const handleReorient = () => {
      resize();
      setRevealed(false);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", handleReorient);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", handleReorient);
    };
  }, []);

  type PointerEvt = MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>;

  const getPos = (e: PointerEvt) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const point = "touches" in e ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const scratch = (e: PointerEvt) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4 * 40) {
      if (data[i] === 0) cleared++;
    }
    if (cleared / (data.length / (4 * 40)) > 0.5) setRevealed(true);
  };

  const onDown = (e: PointerEvt) => {
    drawing.current = true;
    scratch(e);
  };
  const onMove = (e: PointerEvt) => {
    if (drawing.current) scratch(e);
  };
  const onUp = () => {
    drawing.current = false;
  };

  return (
    <div className="panel">
      <h2>Scratch &amp; Reveal</h2>
      <div className="desc">Use your finger or mouse to scratch the card.</div>
      <div className="scratch-wrap">
        <div className="scratch-canvas-holder" ref={holderRef}>
          <div className="scratch-note">{SCRATCH_NOTE}</div>
          <canvas
            ref={canvasRef}
            className="scratch-canvas"
            style={{ opacity: revealed ? 0 : 1, transition: "opacity 0.6s ease" }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={onDown}
            onTouchMove={onMove}
            onTouchEnd={onUp}
          />
        </div>
        <div className="scratch-hint">{revealed ? "There it is 🎉" : "Keep scratching..."}</div>
      </div>
    </div>
  );
}
