import { NAMES } from "../data";
import type { ScreenId, SetScreen } from "../types";

interface CharmNavProps {
  screen: ScreenId;
  setScreen: SetScreen;
}

export default function CharmNav({ screen, setScreen }: CharmNavProps) {
  if (screen === "home") return null;
  return (
    <div className="charm-nav">
      <button className="charm-home" onClick={() => setScreen("home")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 11L12 4L21 11"
            stroke="#a85fbb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10V19C5 19.55 5.45 20 6 20H18C18.55 20 19 19.55 19 19V10"
            stroke="#a85fbb"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back home
      </button>
      <span className="pill">
        {NAMES.him.slice(0, 1)} &amp; {NAMES.her.slice(0, 1)}
      </span>
    </div>
  );
}
