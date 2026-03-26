import { Link } from "react-router-dom";

const TermsPage = () => (
  <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
    <div className="mb-8">
      <Link to="/" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Home
      </Link>
    </div>
    <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
      Terms of Service
    </h1>
    <p className="text-on-surface-variant text-lg mb-8">
      Last updated: {new Date().getFullYear()}
    </p>
    <div className="bg-[var(--surface-container-lowest)] rounded-2xl border border-[var(--outline-variant)]/20 p-8 text-center">
      <span className="material-symbols-outlined text-5xl mb-4 block text-primary/40">gavel</span>
      <p className="text-on-surface-variant font-medium text-lg mb-2">Coming Soon</p>
      <p className="text-on-surface-variant text-sm">
        Our terms of service are being drafted. By using NavigAid you agree to use the platform for lawful purposes only and to provide accurate eligibility information.
      </p>
    </div>
  </div>
);

export default TermsPage;
