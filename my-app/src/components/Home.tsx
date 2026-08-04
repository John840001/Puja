import Hero from "./Hero";
import { GAMES } from "../data";
import type { SetScreen } from "../types";

interface HomeProps {
  setScreen: SetScreen;
}

export default function Home({ setScreen }: HomeProps) {
  return (
    <div>
      <Hero />
      <div className="grid">
        {GAMES.map((g) => (
          <div className="game-card" key={g.id} onClick={() => setScreen(g.id)}>
            <div className="icon">{g.icon}</div>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <div className="go">Open →</div>
          </div>
        ))}
      </div>
      <div className="photo-slot">
        <img src="public\images\image.png" alt="Puja and Jonathan" />
      </div>
    </div>
  );
}
