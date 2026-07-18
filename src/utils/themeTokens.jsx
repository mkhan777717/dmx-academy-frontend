
/* ─── Theme color palette ────────────────────────────── */

// Global theme token definitions
export const themeTokensDark = {
  bg: "#000000",
  bgFade: "#000000",
  textPrimary: "rgba(255,255,255,0.92)",
  textSecondary: "rgba(255,255,255,0.38)",
  textMuted: "rgba(255,255,255,0.2)",
  textVeryMuted: "rgba(255,255,255,0.1)",
  accent: "rgba(99,102,241,0.65)",
  accentFaint: "rgba(99,102,241,0.55)",
  divider: "rgba(255,255,255,0.12)",
  statBg: "rgba(255,255,255,0.018)",
  statBorder: "rgba(255,255,255,0.06)",
  statNum: "rgba(255,255,255,0.82)",
  statLabel: "rgba(255,255,255,0.22)",
  ctaPrimary: {
    bg: "rgba(99,102,241,0.18)",
    border: "rgba(99,102,241,0.28)",
    text: "rgba(99,102,241,0.92)",
    bgHover: "rgba(99,102,241,0.32)",
    borderHover: "rgba(99,102,241,0.58)",
  },
  ctaSecondary: {
    color: "rgba(255,255,255,0.72)",
    colorHover: "rgba(255,255,255,1)",
  },
  tickerBorder: "rgba(255,255,255,0.07)",
  tickerText: "rgba(255,255,255,0.22)",
  tickerDot: "rgba(255,255,255,0.08)",
  cornerText: "rgba(255,255,255,0.12)",
  cornerSubtext: "rgba(255,255,255,0.06)",
  vortexNode: "rgba(99,102,241,0.9)",
  vortexLine: "rgba(99,102,241,0.15)",
};

export const themeTokensLight = {
  bg: "#f8fafc",
  bgFade: "#f8fafc",
  textPrimary: "rgba(2,6,23,0.92)",
  textSecondary: "rgba(2,6,23,0.52)",
  textMuted: "rgba(2,6,23,0.32)",
  textVeryMuted: "rgba(2,6,23,0.15)",
  accent: "rgba(79,70,229,0.75)",
  accentFaint: "rgba(79,70,229,0.65)",
  divider: "rgba(2,6,23,0.12)",
  statBg: "rgba(2,6,23,0.018)",
  statBorder: "rgba(2,6,23,0.07)",
  statNum: "rgba(2,6,23,0.82)",
  statLabel: "rgba(2,6,23,0.32)",
  ctaPrimary: {
    bg: "rgba(99,102,241,0.10)",
    border: "rgba(99,102,241,0.25)",
    text: "rgba(67,56,202,0.92)",
    bgHover: "rgba(99,102,241,0.18)",
    borderHover: "rgba(99,102,241,0.5)",
  },
  ctaSecondary: {
    color: "rgba(2,6,23,0.75)",
    colorHover: "rgba(2,6,23,1)",
  },
  tickerBorder: "rgba(2,6,23,0.07)",
  tickerText: "rgba(2,6,23,0.28)",
  tickerDot: "rgba(2,6,23,0.12)",
  cornerText: "rgba(2,6,23,0.2)",
  cornerSubtext: "rgba(2,6,23,0.1)",
  vortexNode: "rgba(79,70,229,0.9)",
  vortexLine: "rgba(99,102,241,0.15)",
};

// Returns correct theme tokens based on theme mode
export function getThemeTokens(dark) {
  return dark ? themeTokensDark : themeTokensLight;
}