import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const FaqItem = ({ q, a }: { q: string; a: string }) => (
  <div className="border-b border-[var(--outline-variant)]/20 pb-5 last:border-0 last:pb-0">
    <p className="font-semibold text-on-surface text-sm mb-1.5">{q}</p>
    <p className="text-on-surface-variant text-sm leading-relaxed">{a}</p>
  </div>
);

const ContactPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
      {/* Back nav */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mb-10">
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Back to Home
      </Link>

      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-container mb-6">
          <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-3">
          Contact Support
        </h1>
        <p className="text-on-surface-variant text-lg font-body">
          We're here to help. Reach out with questions, feedback, or accessibility concerns.
        </p>
      </div>

      {/* Contact options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
        <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
          </div>
          <h3 className="font-bold font-headline text-on-surface mb-1">AI Chat</h3>
          <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
            Get instant answers about aid programs, eligibility, and the application process.
          </p>
          <button
            onClick={() => navigate("/results")}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-[var(--on-primary)] font-bold text-sm hover:bg-primary-dim transition-all"
          >
            Open Chat
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>

        <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
          </div>
          <h3 className="font-bold font-headline text-on-surface mb-1">Email Support</h3>
          <p className="text-sm text-on-surface-variant mb-4 leading-relaxed">
            For account issues, feedback, or accessibility concerns, send us a message.
          </p>
          <a
            href="mailto:support@navigaid.org"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all"
          >
            support@navigaid.org
          </a>
        </div>
      </div>

      {/* FAQ */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold font-headline text-on-surface mb-6">Frequently Asked Questions</h2>
        <div className="bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 rounded-2xl p-6 space-y-5">
          <FaqItem
            q="Is NavigAid free to use?"
            a="Yes. NavigAid is completely free. Creating an account is optional but lets you save conversations and track your applications."
          />
          <FaqItem
            q="Does NavigAid apply to programs on my behalf?"
            a="No. NavigAid is an informational tool that helps you discover and understand programs. You apply directly through the relevant government agency."
          />
          <FaqItem
            q="Is my eligibility information private?"
            a="Yes. Your profile information is used only to personalise your aid matches and is never sold to third parties. See our Privacy Policy for full details."
          />
          <FaqItem
            q="How accurate is the AI assistant?"
            a="The AI is trained to give helpful, plain-language guidance based on publicly available information. However, program rules change frequently — always verify details directly with the administering agency."
          />
          <FaqItem
            q="How do I delete my account?"
            a="Account deletion is coming soon. In the meantime, email us at support@navigaid.org and we will remove your account and data within 5 business days."
          />
          <FaqItem
            q="I found an accessibility issue. What should I do?"
            a="Please email us with a description of the issue and the assistive technology you use. We treat accessibility reports as high priority."
          />
        </div>
      </section>

      {/* Response time note */}
      <div className="bg-secondary-container/40 border border-primary/10 rounded-2xl px-6 py-5 mb-10">
        <div className="flex gap-3 items-start">
          <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">schedule</span>
          <div>
            <p className="font-semibold text-on-surface text-sm mb-1">Response Times</p>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              We aim to respond to all email inquiries within 2 business days. For urgent accessibility concerns, please note "Accessibility" in your subject line for priority handling.
            </p>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-[var(--outline-variant)]/20 pt-8 mt-8 flex flex-wrap gap-6 text-sm text-on-surface-variant">
        <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        <Link to="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
      </div>
    </div>
  );
};

export default ContactPage;
