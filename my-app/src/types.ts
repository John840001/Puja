import type { Dispatch, SetStateAction } from "react";

export type ScreenId =
  | "home"
  | "memory"
  | "wheel"
  | "scratch"
  | "letter"
  | "letters";

export type SetScreen = Dispatch<SetStateAction<ScreenId>>;

export interface LoveLetter {
  id: string;
  author: "him" | "her";
  title: string;
  body: string;
  created_at: string; // ISO timestamp, set by the database
}
