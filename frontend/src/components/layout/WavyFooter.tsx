const WavyFooter = () => {
  return (
    <div className="w-full overflow-hidden pointer-events-none select-none" aria-hidden="true">
      <svg
        viewBox="0 0 390 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <path
          d="M0 40C60 20 120 60 195 50C270 40 330 10 390 30V120H0V40Z"
          fill="hsl(var(--primary) / 0.12)"
        />
        <path
          d="M0 60C80 40 140 80 210 65C280 50 340 30 390 50V120H0V60Z"
          fill="hsl(var(--accent) / 0.15)"
        />
        <path
          d="M0 80C70 65 150 95 220 80C290 65 350 50 390 70V120H0V80Z"
          fill="hsl(var(--primary) / 0.08)"
        />
      </svg>
    </div>
  );
};

export default WavyFooter;
