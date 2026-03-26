import { Link } from "react-router-dom";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold font-headline text-on-surface mb-3">{title}</h2>
    <div className="space-y-3 text-on-surface-variant font-body leading-relaxed text-sm sm:text-base">
      {children}
    </div>
  </section>
);

const FeatureCard = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="flex gap-4 bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 rounded-2xl p-5">
    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center shrink-0 mt-0.5">
      <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
    </div>
    <div>
      <p className="font-semibold text-on-surface text-sm mb-1">{title}</p>
      <p className="text-on-surface-variant text-sm">{desc}</p>
    </div>
  </div>
);

const AccessibilityPage = () => (
  <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
    {/* Back nav */}
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mb-10">
      <span className="material-symbols-outlined text-base">arrow_back</span>
      Back to Home
    </Link>

    {/* Hero */}
    <div className="mb-12">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-container mb-6">
        <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>accessibility_new</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-3">
        Accessibility
      </h1>
      <p className="text-on-surface-variant">Our commitment to an inclusive experience for everyone.</p>
    </div>

    {/* Commitment callout */}
    <div className="bg-secondary-container/40 border border-primary/10 rounded-2xl px-6 py-5 mb-10">
      <p className="text-sm text-on-surface font-medium leading-relaxed">
        NavigAid is built with the belief that access to government aid information should be available to everyone — regardless of ability, device, or technical background. We are actively working to meet and exceed WCAG 2.1 Level AA guidelines.
      </p>
    </div>

    {/* Feature grid */}
    <section className="mb-10">
      <h2 className="text-xl font-bold font-headline text-on-surface mb-4">What We've Built In</h2>
      <div className="space-y-3">
        <FeatureCard
          icon="keyboard"
          title="Keyboard Navigation"
          desc="All interactive elements — buttons, links, forms, and modals — are fully navigable using a keyboard alone."
        />
        <FeatureCard
          icon="contrast"
          title="Colour Contrast"
          desc="Text and UI elements are designed to meet or exceed the 4.5:1 contrast ratio required for normal text under WCAG 2.1 AA."
        />
        <FeatureCard
          icon="label"
          title="Screen Reader Support"
          desc="Interactive controls include descriptive aria-labels. Form fields use proper labelling so screen readers can convey context accurately."
        />
        <FeatureCard
          icon="text_fields"
          title="Readable Typography"
          desc="We use clear, legible typefaces with generous line heights and scalable font sizes to support users with low vision."
        />
        <FeatureCard
          icon="devices"
          title="Responsive Design"
          desc="NavigAid works across all screen sizes — from mobile phones to large desktop monitors — without loss of functionality."
        />
        <FeatureCard
          icon="smart_toy"
          title="Plain-Language AI"
          desc="The NavigAid AI assistant is instructed to explain government programs in plain, jargon-free language that is easy to understand."
        />
      </div>
    </section>

    <Section title="Known Limitations">
      <p>We are still actively improving accessibility across the platform. Known areas we are working on include:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Improved focus management in dialog and modal components.</li>
        <li>Enhanced skip navigation links for keyboard and screen reader users.</li>
        <li>Full ARIA live region support for dynamic chat content.</li>
      </ul>
    </Section>

    <Section title="Third-Party Content">
      <p>NavigAid references government aid programs from third-party sources. While we aim to present this information accessibly, we cannot control the accessibility of external government websites that applications may link to.</p>
    </Section>

    <Section title="Feedback & Reporting Issues">
      <p>If you experience any accessibility barriers while using NavigAid, we want to hear about it. Please use the <Link to="/contact" className="text-primary hover:underline font-medium">Contact Support</Link> page to report issues and we will work to address them promptly.</p>
      <p>When reporting, it helps to include:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>The page or feature where the issue occurred.</li>
        <li>The assistive technology you were using (e.g., NVDA, VoiceOver, JAWS).</li>
        <li>A brief description of what happened vs. what you expected.</li>
      </ul>
    </Section>

    {/* Footer nav */}
    <div className="border-t border-[var(--outline-variant)]/20 pt-8 mt-8 flex flex-wrap gap-6 text-sm text-on-surface-variant">
      <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
      <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
      <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
    </div>
  </div>
);

export default AccessibilityPage;
