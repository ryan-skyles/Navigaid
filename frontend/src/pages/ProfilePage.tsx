import { useNavigate } from "react-router-dom";

const statusConfig: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-emerald-100", text: "text-emerald-700" },
  pending: { bg: "bg-amber-100", text: "text-amber-700" },
  waitlist: { bg: "bg-slate-100", text: "text-slate-500" },
};

const mockApplications = [
  {
    id: "1",
    icon: "home",
    program: "Greenfield Apartments",
    description: "Affordable Housing – 2BR unit, $850/mo",
    status: "approved",
    advisor: "Elena Rodriguez",
  },
  {
    id: "2",
    icon: "confirmation_number",
    program: "Section 8 Voucher",
    description: "Housing Choice Voucher Program",
    status: "pending",
    advisor: "Marcus Chen",
  },
  {
    id: "3",
    icon: "accessible",
    program: "Riverside Community",
    description: "Senior & Disability Housing – 1BR",
    status: "waitlist",
    advisor: "Elena Rodriguez",
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
          Profile
        </h2>
        <p className="text-on-surface-variant text-lg max-w-2xl font-body">
          Manage your account and track the status of your aid applications.
        </p>
      </div>

      {/* User Card */}
      <div className="bg-[var(--surface-container-lowest)] rounded-2xl p-8 editorial-shadow flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl">person</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold font-headline text-on-surface">Alex Johnson</h3>
          <p className="text-on-surface-variant font-body">Housing Applicant</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-on-surface-variant">Verified Status</span>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold font-headline text-on-surface">Your Applications</h3>
          <button
            onClick={() => navigate("/situations")}
            className="text-primary font-bold flex items-center gap-2 hover:underline text-sm"
          >
            Browse Programs <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>

        <div className="space-y-4">
          {mockApplications.map((app) => {
            const status = statusConfig[app.status] ?? statusConfig.waitlist;

            return (
              <div
                key={app.id}
                className="group bg-[var(--surface-container-lowest)] rounded-2xl p-6 transition-all hover:shadow-editorial-hover flex items-center justify-between border border-transparent hover:border-primary/10"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {app.icon}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-lg font-bold font-headline text-on-surface">{app.program}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${status.bg} ${status.text}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant">{app.description}</p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Advisor: <span className="font-medium">{app.advisor}</span>
                    </p>
                  </div>
                </div>

                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--surface-container)] hover:bg-primary hover:text-[var(--on-primary)] transition-all active:scale-90">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
