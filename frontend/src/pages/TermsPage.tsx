import { Link } from "react-router-dom";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold font-headline text-on-surface mb-3">{title}</h2>
    <div className="space-y-3 text-on-surface-variant font-body leading-relaxed text-sm sm:text-base">
      {children}
    </div>
  </section>
);

const TermsPage = () => (
  <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
    {/* Back nav */}
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mb-10">
      <span className="material-symbols-outlined text-base">arrow_back</span>
      Back to Home
    </Link>

    {/* Hero */}
    <div className="mb-12">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-container mb-6">
        <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-3">
        Terms of Service
      </h1>
      <p className="text-on-surface-variant">Last updated: January 1, {new Date().getFullYear()}</p>
    </div>

    {/* Intro callout */}
    <div className="bg-secondary-container/40 border border-primary/10 rounded-2xl px-6 py-5 mb-10">
      <p className="text-sm text-on-surface font-medium leading-relaxed">
        By using NavigAid, you agree to these terms. NavigAid is a free informational tool designed to help individuals find government aid programs. It is not a legal service and does not guarantee eligibility or approval for any program.
      </p>
    </div>

    <Section title="1. Acceptance of Terms">
      <p>By accessing or using the NavigAid platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
      <p>We reserve the right to update these terms at any time. Continued use of the Service after changes constitutes your acceptance of the revised terms.</p>
    </Section>

    <Section title="2. Description of Service">
      <p>NavigAid provides an AI-powered search and guidance tool to help users identify government assistance programs they may qualify for. This includes:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>AI-assisted chat for aid program discovery.</li>
        <li>An eligibility profile to personalize recommendations.</li>
        <li>Saved conversation history for registered users.</li>
      </ul>
      <p>NavigAid is an informational resource only. We are not affiliated with any government agency and do not process applications or make eligibility determinations.</p>
    </Section>

    <Section title="3. User Accounts">
      <p>You may use parts of the Service as a guest. To save conversations and access personalized features, you must create an account. You are responsible for:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Providing accurate information when creating your account.</li>
        <li>Keeping your password secure and confidential.</li>
        <li>All activity that occurs under your account.</li>
      </ul>
      <p>You must be at least 13 years of age to create an account.</p>
    </Section>

    <Section title="4. Acceptable Use">
      <p>You agree to use the Service only for lawful purposes. You may not:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Submit false or misleading information to manipulate AI responses.</li>
        <li>Use the Service to harass, defraud, or harm others.</li>
        <li>Attempt to reverse-engineer, scrape, or exploit the Service.</li>
        <li>Use automated bots or scripts to access the Service without permission.</li>
      </ul>
    </Section>

    <Section title="5. Accuracy of Information">
      <p>NavigAid strives to provide accurate and up-to-date information about aid programs. However, government programs change frequently. We make no warranties that the information provided is complete, current, or error-free.</p>
      <p>Always verify eligibility requirements and application processes directly with the relevant government agency before submitting any application.</p>
    </Section>

    <Section title="6. Limitation of Liability">
      <p>To the fullest extent permitted by law, NavigAid and its operators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including reliance on any information provided by the AI assistant.</p>
    </Section>

    <Section title="7. Termination">
      <p>We reserve the right to suspend or terminate your account if you violate these terms or if required by law. You may delete your account at any time from your profile settings.</p>
    </Section>

    <Section title="8. Governing Law">
      <p>These terms are governed by the laws of the United States. Any disputes arising under these terms shall be resolved in a court of competent jurisdiction.</p>
    </Section>

    <Section title="9. Contact">
      <p>Questions about these terms? Reach out via our <Link to="/contact" className="text-primary hover:underline font-medium">Contact Support</Link> page.</p>
    </Section>

    {/* Footer nav */}
    <div className="border-t border-[var(--outline-variant)]/20 pt-8 mt-8 flex flex-wrap gap-6 text-sm text-on-surface-variant">
      <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
      <Link to="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
      <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
    </div>
  </div>
);

export default TermsPage;
