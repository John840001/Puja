import { useState } from "react";
import AmbientBackground from "./components/AmbientBackground";
import CharmNav from "./components/CharmNav";
import Home from "./components/Home";
import MemoryGame from "./components/MemoryGame";
import WheelGame from "./components/WheelGame";
import ScratchGame from "./components/ScratchGame";
import LetterScreen from "./components/LetterScreen";
import type { ScreenId } from "./types";

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("home");

  const screens: Record<ScreenId, React.ReactNode> = {
    home: <Home setScreen={setScreen} />,
    memory: <MemoryGame />,
    wheel: <WheelGame />,
    scratch: <ScratchGame />,
    letter: <LetterScreen />,
  };

  return (
    <>
      <AmbientBackground />
      <div className="app-shell">
        <CharmNav screen={screen} setScreen={setScreen} />
        {screens[screen]}
      </div>
    </>
  );
}
