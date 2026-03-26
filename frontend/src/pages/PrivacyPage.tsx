import { Link } from "react-router-dom";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-xl font-bold font-headline text-on-surface mb-3">{title}</h2>
    <div className="space-y-3 text-on-surface-variant font-body leading-relaxed text-sm sm:text-base">
      {children}
    </div>
  </section>
);

const PrivacyPage = () => (
  <div className="max-w-3xl mx-auto px-6 py-12 sm:py-20">
    {/* Back nav */}
    <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline mb-10">
      <span className="material-symbols-outlined text-base">arrow_back</span>
      Back to Home
    </Link>

    {/* Hero */}
    <div className="mb-12">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary-container mb-6">
        <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-3">
        Privacy Policy
      </h1>
      <p className="text-on-surface-variant">Last updated: January 1, {new Date().getFullYear()}</p>
    </div>

    {/* Intro callout */}
    <div className="bg-secondary-container/40 border border-primary/10 rounded-2xl px-6 py-5 mb-10">
      <p className="text-sm text-on-surface font-medium leading-relaxed">
        NavigAid is committed to protecting your privacy. We collect only what we need to help match you with aid programs and never sell your personal information to third parties.
      </p>
    </div>

    <Section title="1. Information We Collect">
      <p>When you use NavigAid, we may collect the following types of information:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li><strong className="text-on-surface">Account information</strong> — name, email address, and password when you create an account.</li>
        <li><strong className="text-on-surface">Eligibility profile</strong> — household size, income, employment status, housing status, disability status, and veteran status that you voluntarily provide.</li>
        <li><strong className="text-on-surface">Chat history</strong> — conversations with the NavigAid AI assistant, saved to your account when you are logged in.</li>
        <li><strong className="text-on-surface">Usage data</strong> — general information about how you interact with the platform (e.g., pages visited) to improve our service.</li>
      </ul>
    </Section>

    <Section title="2. How We Use Your Information">
      <p>We use the information we collect to:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Match you with government aid programs relevant to your situation.</li>
        <li>Personalize your experience and save your conversation history.</li>
        <li>Improve the accuracy and relevance of our AI assistant.</li>
        <li>Send service-related communications (e.g., account confirmations).</li>
        <li>Comply with legal obligations.</li>
      </ul>
      <p>We do <strong className="text-on-surface">not</strong> use your information for advertising or sell it to any third party.</p>
    </Section>

    <Section title="3. Data Storage & Security">
      <p>Your data is stored securely on servers in the United States. We use industry-standard practices including encrypted connections (HTTPS) and hashed password storage to protect your information.</p>
      <p>While we take reasonable precautions, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your NavigAid account.</p>
    </Section>

    <Section title="4. AI Chat Conversations">
      <p>When you are logged in, your chat conversations are saved to your account so you can resume them later. Guest conversations (not logged in) are stored locally in your browser and are never sent to our servers beyond what is necessary to generate AI responses.</p>
      <p>Conversations may be used in aggregate and anonymized form to improve the AI assistant's responses to aid-related questions.</p>
    </Section>

    <Section title="5. Your Rights">
      <p>You have the right to:</p>
      <ul className="list-disc list-inside space-y-1 pl-2">
        <li>Access the personal information we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your account and associated data.</li>
        <li>Opt out of non-essential communications.</li>
      </ul>
      <p>To exercise any of these rights, please visit the <Link to="/contact" className="text-primary hover:underline font-medium">Contact Support</Link> page.</p>
    </Section>

    <Section title="6. Cookies">
      <p>NavigAid uses minimal browser storage (localStorage) to keep you logged in and to save guest chat sessions. We do not use third-party tracking cookies or advertising pixels.</p>
    </Section>

    <Section title="7. Changes to This Policy">
      <p>We may update this policy from time to time. When we do, we will update the "last updated" date at the top of this page. Continued use of NavigAid after changes constitutes your acceptance of the updated policy.</p>
    </Section>

    <Section title="8. Contact Us">
      <p>If you have questions about this privacy policy, please reach out via our <Link to="/contact" className="text-primary hover:underline font-medium">Contact Support</Link> page.</p>
    </Section>

    {/* Footer nav */}
    <div className="border-t border-[var(--outline-variant)]/20 pt-8 mt-8 flex flex-wrap gap-6 text-sm text-on-surface-variant">
      <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
      <Link to="/accessibility" className="hover:text-primary transition-colors">Accessibility</Link>
      <Link to="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
    </div>
  </div>
);

export default PrivacyPage;
