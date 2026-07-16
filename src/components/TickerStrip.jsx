
import React from "react";

/* ─── Ticker Strip ───────────────────────────────────── */
const tickers = [
  "Interactive Browser Sandboxes",
  "Live Cohort Sessions",
  "Real-Time Feedback",
  "50+ Real Projects",
  "Learn from Industry Experts",
  "AI-Powered Learning",
  "Code. Build. Deploy.",
];

const TickerStrip = ({ tok }) => {
  const items = [...tickers, ...tickers];
  return (
    <div className="overflow-hidden border-y" style={{ borderColor: tok.tickerBorder }}>
      <div className="ticker-track py-2.5">
        {items.map((t, i) => (
          <span
            key={i}
            className="mx-8 text-xl font-medium tracking-[0.18em] uppercase whitespace-nowrap"
            style={{ color: tok.tickerText }}
          >
            {t}
            <span className="mx-8" style={{ color: tok.tickerDot }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TickerStrip;

       