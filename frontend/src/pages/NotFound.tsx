import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="material-symbols-outlined text-[8rem] text-primary/20 mb-4">
        explore_off
      </span>
      <h1 className="text-5xl md:text-6xl font-extrabold font-headline text-on-surface mb-4">
        404
      </h1>
      <p className="text-xl text-on-surface-variant mb-8 max-w-md font-body">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-[var(--on-primary)] font-headline font-bold hover:bg-primary-dim transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
      >
        <span className="material-symbols-outlined text-lg">home</span>
        Return Home
      </Link>
    </div>
  );
};

export default NotFound;
