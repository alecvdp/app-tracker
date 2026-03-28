export type ThemeMode = "light" | "dark";

export type PalettePreset =
  | "warm"
  | "nord"
  | "gruvbox"
  | "catppuccin"
  | "rosepine"
  | "tokyonight";

export interface PaletteColors {
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  text: string;
  textMuted: string;
  textFaint: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  border: string;
}

export interface ThemeConfig {
  mode: ThemeMode;
  palette: PalettePreset;
}

export const PALETTE_PRESETS: Record<PalettePreset, { label: string }> = {
  warm: { label: "Warm" },
  nord: { label: "Nord" },
  gruvbox: { label: "Gruvbox" },
  catppuccin: { label: "Catppuccin" },
  rosepine: { label: "Rosé Pine" },
  tokyonight: { label: "Tokyo Night" },
};

// Light mode palettes
export const LIGHT_PALETTES: Record<PalettePreset, PaletteColors> = {
  warm: {
    bg: "#F5F0E8",
    bgSecondary: "#EDE7DB",
    bgTertiary: "#E4DCCE",
    text: "#3B3228",
    textMuted: "#7A6E5E",
    textFaint: "#A89F91",
    accent: "#B0704F",
    accentSecondary: "#7B8F6B",
    accentTertiary: "#6B7FA0",
    border: "#D6CBBA",
  },
  nord: {
    bg: "#ECEFF4",
    bgSecondary: "#E5E9F0",
    bgTertiary: "#D8DEE9",
    text: "#2E3440",
    textMuted: "#4C566A",
    textFaint: "#7B88A1",
    accent: "#5E81AC",
    accentSecondary: "#A3BE8C",
    accentTertiary: "#B48EAD",
    border: "#D1D7E3",
  },
  gruvbox: {
    bg: "#FBF1C7",
    bgSecondary: "#F2E5BC",
    bgTertiary: "#EBDBB2",
    text: "#3C3836",
    textMuted: "#665C54",
    textFaint: "#928374",
    accent: "#AF3A03",
    accentSecondary: "#79740E",
    accentTertiary: "#076678",
    border: "#D5C4A1",
  },
  catppuccin: {
    bg: "#EFF1F5",
    bgSecondary: "#E6E9EF",
    bgTertiary: "#DCE0E8",
    text: "#4C4F69",
    textMuted: "#6C6F85",
    textFaint: "#9CA0B0",
    accent: "#E64553",
    accentSecondary: "#40A02B",
    accentTertiary: "#7287FD",
    border: "#CCD0DA",
  },
  rosepine: {
    bg: "#FAF4ED",
    bgSecondary: "#F2E9E1",
    bgTertiary: "#EBE0D8",
    text: "#575279",
    textMuted: "#797593",
    textFaint: "#9893A5",
    accent: "#D7827E",
    accentSecondary: "#56949F",
    accentTertiary: "#907AA9",
    border: "#DFD7CE",
  },
  tokyonight: {
    bg: "#D5D6DB",
    bgSecondary: "#CBCCD1",
    bgTertiary: "#C0C1C7",
    text: "#343B59",
    textMuted: "#4C5272",
    textFaint: "#7A7F95",
    accent: "#8C6C3E",
    accentSecondary: "#33635C",
    accentTertiary: "#34548A",
    border: "#B8B9BF",
  },
};

// Dark mode palettes
export const DARK_PALETTES: Record<PalettePreset, PaletteColors> = {
  warm: {
    bg: "#1E2127",
    bgSecondary: "#252830",
    bgTertiary: "#2C303A",
    text: "#C8C4BE",
    textMuted: "#8B8780",
    textFaint: "#5E5A54",
    accent: "#D4946B",
    accentSecondary: "#8BAF7B",
    accentTertiary: "#7B9FBF",
    border: "#383C46",
  },
  nord: {
    bg: "#2E3440",
    bgSecondary: "#3B4252",
    bgTertiary: "#434C5E",
    text: "#ECEFF4",
    textMuted: "#A5ADBD",
    textFaint: "#6B7389",
    accent: "#88C0D0",
    accentSecondary: "#A3BE8C",
    accentTertiary: "#B48EAD",
    border: "#4C566A",
  },
  gruvbox: {
    bg: "#282828",
    bgSecondary: "#32302F",
    bgTertiary: "#3C3836",
    text: "#EBDBB2",
    textMuted: "#A89984",
    textFaint: "#665C54",
    accent: "#FE8019",
    accentSecondary: "#B8BB26",
    accentTertiary: "#83A598",
    border: "#504945",
  },
  catppuccin: {
    bg: "#1E1E2E",
    bgSecondary: "#252536",
    bgTertiary: "#313244",
    text: "#CDD6F4",
    textMuted: "#A6ADC8",
    textFaint: "#6C7086",
    accent: "#F38BA8",
    accentSecondary: "#A6E3A1",
    accentTertiary: "#89B4FA",
    border: "#45475A",
  },
  rosepine: {
    bg: "#191724",
    bgSecondary: "#1F1D2E",
    bgTertiary: "#26233A",
    text: "#E0DEF4",
    textMuted: "#908CAA",
    textFaint: "#6E6A86",
    accent: "#EBBCBA",
    accentSecondary: "#9CCFD8",
    accentTertiary: "#C4A7E7",
    border: "#393552",
  },
  tokyonight: {
    bg: "#1A1B26",
    bgSecondary: "#1F2029",
    bgTertiary: "#292A37",
    text: "#A9B1D6",
    textMuted: "#737AA2",
    textFaint: "#545C7E",
    accent: "#E0AF68",
    accentSecondary: "#9ECE6A",
    accentTertiary: "#7AA2F7",
    border: "#3B3D57",
  },
};

export function getPalette(mode: ThemeMode, preset: PalettePreset): PaletteColors {
  return mode === "light" ? LIGHT_PALETTES[preset] : DARK_PALETTES[preset];
}

// Status colors (these work well across palettes)
export const STATUS_COLORS = {
  using: { light: "#40A02B", dark: "#A6E3A1" },
  not_using: { light: "#6C6F85", dark: "#6C7086" },
  watching: { light: "#DF8E1D", dark: "#FAB387" },
  sunset: { light: "#E64553", dark: "#F38BA8" },
};

export const DEFAULT_THEME: ThemeConfig = {
  mode: "light",
  palette: "warm",
};
