import type { Dispatch, SetStateAction } from "react";

export type ScreenId = "home" | "memory" | "wheel" | "scratch" | "letter";

export type SetScreen = Dispatch<SetStateAction<ScreenId>>;
