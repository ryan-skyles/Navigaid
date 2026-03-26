import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-lg w-full">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-secondary-container mb-8">
          <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            explore_off
          </span>
        </div>

        {/* Headline */}
        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3 font-label">
          Error 404
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface mb-4 tracking-tight">
          Page not found
        </h1>
        <p className="text-lg text-on-surface-variant mb-10 max-w-sm mx-auto font-body leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-[var(--on-primary)] font-headline font-bold hover:bg-primary-dim transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Return Home
          </Link>
          <Link
            to="/results"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[var(--surface-container)] text-on-surface font-headline font-bold hover:bg-[var(--surface-container-high)] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-lg">chat</span>
            Ask AI for Help
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
