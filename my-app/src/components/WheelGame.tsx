import { useState } from "react";
import { WHEEL_OPTIONS } from "../data";

const COLORS = ["#f5abc9", "#d7a3de", "#f0c77a", "#ec80ab", "#c98fd6", "#f6cfe0"];

export default function WheelGame() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const sliceAngle = 360 / WHEEL_OPTIONS.length;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult("");
    const chosenIndex = Math.floor(Math.random() * WHEEL_OPTIONS.length);
    const targetAngle = 360 * 5 + (360 - (chosenIndex * sliceAngle + sliceAngle / 2));
    setRotation((prev) => prev + targetAngle);
    setTimeout(() => {
      setSpinning(false);
      setResult(WHEEL_OPTIONS[chosenIndex]);
    }, 4000);
  };

  const gradient = WHEEL_OPTIONS.map((_, i) => {
    const start = (i * sliceAngle).toFixed(2);
    const end = ((i + 1) * sliceAngle).toFixed(2);
    return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
  }).join(", ");

  return (
    <div className="panel">
      <h2>Date Night Wheel</h2>
      <div className="desc">Spin it. Whatever it lands on, that's the plan.</div>
      <div className="wheel-wrap">
        <div className="wheel-pointer"></div>
        <div
          className="wheel-disc"
          style={{
            background: `conic-gradient(${gradient})`,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="wheel-center">🎡</div>
        </div>
        <button className="spin-btn" onClick={spin} disabled={spinning}>
          {spinning ? "Spinning..." : "Spin the wheel"}
        </button>
        <div className="wheel-result">{result && `It's "${result}" tonight 💕`}</div>
      </div>
    </div>
  );
}
