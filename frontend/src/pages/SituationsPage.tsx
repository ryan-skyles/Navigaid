import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const programs = [
  {
    id: "affordable",
    icon: "home",
    name: "Affordable Housing",
    summary: "Income-based rental programs that cap your rent at 30% of income.",
    tag: "Verified",
    details:
      "Affordable housing programs are government-subsidized residences that set rent limits based on your household income. Eligible tenants typically pay no more than 30% of their adjusted gross income toward rent. Programs vary by city and state — applications may involve income verification, background checks, and waitlists. Contact your local housing authority to learn more.",
  },
  {
    id: "disability",
    icon: "accessible",
    name: "Disability Benefits",
    summary: "Housing assistance for individuals with physical or developmental disabilities.",
    tag: "Fast-Track",
    details:
      "If you or a household member has a qualifying disability, you may be eligible for priority placement, accessible unit modifications, or supplemental vouchers. Programs like Section 811 provide affordable housing paired with supportive services. Documentation from a medical provider is typically required during application.",
  },
  {
    id: "vouchers",
    icon: "confirmation_number",
    name: "Housing Vouchers",
    summary: "Section 8 and similar vouchers that help pay for private-market rentals.",
    tag: "Active",
    details:
      "Housing Choice Vouchers (Section 8) let you choose a privately-owned rental that meets program standards. The voucher covers a portion of the rent, and you pay the difference. Eligibility is based on income, family size, and citizenship status. Waitlists can be long — it's important to apply early and at multiple housing authorities.",
  },
  {
    id: "health",
    icon: "medical_services",
    name: "Community Health Grant",
    summary: "Direct financial support for specialized treatments and rehabilitation services.",
    tag: "Verified",
    details:
      "Community Health Grants provide funding for medical treatments, rehabilitation services, and mental health support for low-income families. These grants can cover everything from prescription medications to specialized therapy sessions. Eligibility varies by program and locality.",
  },
  {
    id: "education",
    icon: "school",
    name: "Edu-Future Scholarship",
    summary: "Vocational training and university subsidies for sustainable technology careers.",
    tag: "Fast-Track",
    details:
      "Edu-Future Scholarships support students pursuing careers in sustainable technologies through vocational training programs and university subsidies. These scholarships cover tuition, materials, and in some cases living expenses during the study period.",
  },
];

const SituationsPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
          Aid Programs
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl font-body">
          Explore curated assistance programs with high success rates and streamlined application processes.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined text-base">location_on</span>
          <span className="text-sm font-medium">Location:</span>
          <span className="text-sm text-primary font-bold">United States</span>
        </div>
        <button
          onClick={() => navigate("/results")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-[var(--on-primary)] font-bold hover:bg-primary-dim transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">search</span>
          Search All Programs
        </button>
      </div>

      {/* Program Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {programs.map((prog) => {
          const isOpen = expanded === prog.id;
          return (
            <div
              key={prog.id}
              className="bg-[var(--surface-container-lowest)] rounded-xl p-8 border border-[var(--outline-variant)]/10 hover:shadow-editorial-hover transition-all cursor-pointer group"
              onClick={() => setExpanded(isOpen ? null : prog.id)}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="h-12 w-12 rounded-xl bg-secondary-container flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {prog.icon}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-on-surface-variant shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </div>

              <h4 className="text-xl font-headline font-bold mb-2">{prog.name}</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body mb-4">
                {prog.summary}
              </p>

              {isOpen && (
                <div className="pt-4 border-t border-[var(--outline-variant)]/10 mb-4">
                  <p className="text-on-surface text-sm leading-relaxed font-body">{prog.details}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[var(--outline-variant)]/5">
                <span className="text-xs font-bold text-[var(--outline)] uppercase tracking-wider">
                  {prog.tag}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/results", { state: { initialMessage: `Tell me about ${prog.name}` } });
                  }}
                  className="text-primary text-sm font-bold"
                >
                  Learn More
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SituationsPage;
