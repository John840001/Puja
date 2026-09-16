/* =========================================================
   EDIT ZONE — swap in your own details, dates, and copy.
   This is the only file most people need to touch.
   ========================================================= */

import type { ScreenId } from "./types";

export const NAMES = { him: "Jonathan", her: "Puja" };

// Your actual anniversary date, format YYYY-MM-DD
export const START_DATE = "2025-07-31";

export const BIKE_NAME = "Raven";

export const LETTER_TEXT = `My Puja,

One year ago I didn't know that a bike ride, a plate of biryani, and way too much ice cream would somehow turn into my favorite year yet.

Thank you for every ride on ${BIKE_NAME} with the wind in your hair, every biryani order that somehow turns into a debate, and every ice cream run at the worst possible hour.

Here's to year two — same bike, same us, more places to see.

Happy 1st Anniversary.`;

// Icons used in the Memory Match game
export const MEMORY_ICONS = ["🏍️", "🍛", "🍦", "🌙", "💜", "⭐", "💩", "😽"];

// Options on the Date Night Wheel
export const WHEEL_OPTIONS = [
  `Bike ride with ${BIKE_NAME}`,
  "Biryani night",
  "Ice cream run",
  "Movie + blanket",
  "Cook together",
  "Long drive, no plan",
];

// Message revealed by the scratch card
export const SCRATCH_NOTE = `You + me + ${BIKE_NAME} + biryani = my favorite kind of ordinary day. 💜`;

// Cards shown on the home screen — id must match a key in screens (App.tsx)
export interface GameCard {
  id: ScreenId;
  icon: string;
  title: string;
  desc: string;
}

export const GAMES: GameCard[] = [
  {
    id: "memory",
    icon: "🧠",
    title: "Memory Match",
    desc: "Match our favorite little things.",
  },
  {
    id: "wheel",
    icon: "🎡",
    title: "Date Night Wheel",
    desc: "Spin for tonight's plan.",
  },
  {
    id: "scratch",
    icon: "✨",
    title: "Scratch & Reveal",
    desc: "Scratch off a tiny secret note.",
  },
  {
    id: "letter",
    icon: "💌",
    title: "Your Letter",
    desc: "Something I wrote just for you.",
  },
  {
    id: "letters",
    icon: "📮",
    title: "Love Letters",
    desc: "A shared collection, saved just for us.",
  },
];
