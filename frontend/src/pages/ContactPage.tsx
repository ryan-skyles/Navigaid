import { Link } from "react-router-dom";

const ContactPage = () => (
  <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
    <div className="mb-8">
      <Link to="/" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Home
      </Link>
    </div>
    <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
      Contact Support
    </h1>
    <div className="bg-[var(--surface-container-lowest)] rounded-2xl border border-[var(--outline-variant)]/20 p-8 text-center">
      <span className="material-symbols-outlined text-5xl mb-4 block text-primary/40">support_agent</span>
      <p className="text-on-surface-variant font-medium text-lg mb-2">Coming Soon</p>
      <p className="text-on-surface-variant text-sm">
        A contact form is on the way. In the meantime, feel free to use the AI chat portal with any questions about aid programs.
      </p>
      <Link
        to="/results"
        className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full bg-primary text-[var(--on-primary)] font-bold text-sm hover:bg-primary-dim transition-all"
      >
        <span className="material-symbols-outlined text-base">chat</span>
        Open AI Chat
      </Link>
    </div>
  </div>
);

export default ContactPage;
