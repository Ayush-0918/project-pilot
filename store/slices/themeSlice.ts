import { StateCreator } from "zustand";

export const ACCENT_THEMES = {
  indigo: "#6366F1",
  green: "#39FF14",
  pink: "#FF2272",
  blue: "#00BFFF",
  purple: "#A020F0",
  orange: "#FF6347",
} as const;

export type AccentTheme = keyof typeof ACCENT_THEMES;

export interface ThemeSlice {
  accentTheme: AccentTheme;

  setAccentTheme: (theme: AccentTheme) => void;
}

export const createThemeSlice: StateCreator<
  any,
  [],
  [],
  ThemeSlice
> = (set) => ({
  accentTheme: "indigo",

  setAccentTheme: (theme) =>
    set({
      accentTheme: theme,
    }),
});