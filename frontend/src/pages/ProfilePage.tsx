import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { getStoredUser } from "@/utils/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

const EMPLOYMENT_OPTIONS = [
  "Employed full-time",
  "Part-time",
  "Self-employed",
  "Unemployed",
  "Student",
  "Retired",
  "Unable to work",
];

const HOUSING_OPTIONS = [
  "Homeowner",
  "Renter",
  "Homeless / Unhoused",
  "Temporary shelter",
  "Living with family or friends",
];

const DISABILITY_OPTIONS = [
  "No disability reported",
  "Physical disability",
  "Mental health disability",
  "Multiple disabilities",
];

const VETERAN_OPTIONS = [
  "Not a veteran",
  "Active duty",
  "Veteran",
  "Disabled veteran",
];

type Application = {
  app_id: number;
  date_submitted: string | null;
  status: string;
  last_updated: string | null;
  program_name: string;
  description_plain_language: string | null;
};

const statusStyles: Record<string, string> = {
  approved: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  waitlist: "bg-neutral text-neutral-foreground",
  denied: "bg-destructive text-destructive-foreground",
};

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const inputClass =
  "w-full h-11 rounded-xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 text-on-surface text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-container/40 transition-all";

const ProfilePage = () => {
  const user = getStoredUser();
  const clientId = user?.clientId;

  // Applications
  const [applications, setApplications] = useState<Application[]>([]);
  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState("");

  // Eligibility form
  const [householdSize, setHouseholdSize] = useState("");
  const [income, setIncome] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [housingStatus, setHousingStatus] = useState("");
  const [disabilityStatus, setDisabilityStatus] = useState("");
  const [veteranStatus, setVeteranStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    const fetchApplications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/clients/${clientId}/profile`);
        if (!res.ok) throw new Error("Failed to load profile data.");
        const data = await res.json();
        setApplications(data.applications ?? []);
      } catch (err) {
        setAppsError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setAppsLoading(false);
      }
    };
    fetchApplications();
  }, [clientId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: user?.firstName ?? "",
          last_name: user?.lastName ?? "",
          email: user?.email ?? "",
          household_size: householdSize ? Number(householdSize) : null,
          income: income ? Number(income) : null,
          employment_status: employmentStatus || null,
          housing_status: housingStatus || null,
          disability_status: disabilityStatus || null,
          veteran_status: veteranStatus || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveError(data?.error || "Failed to save. Please try again.");
        return;
      }
      setSaved(true);
    } catch {
      setSaveError("Network error. Is the backend running?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-6 max-w-3xl mx-auto w-full">

      {/* User Info */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="w-16 h-16 bg-primary/10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Your Profile" : "Your Profile"}
            </h1>
            {user?.email && (
              <div className="flex items-center gap-2 mt-2 text-sm sm:text-base text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Eligibility Profile */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-1">
            Eligibility Profile
          </h2>
          <p className="text-xs text-muted-foreground mb-5">
            Used to match you with programs you qualify for.
          </p>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Household Size</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                  placeholder="e.g. 3"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Annual Income ($)</label>
                <input
                  type="number"
                  min={0}
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="e.g. 35000"
                  className={inputClass}
                />
              </div>
            </div>

            {[
              { label: "Employment Status", value: employmentStatus, setter: setEmploymentStatus, options: EMPLOYMENT_OPTIONS },
              { label: "Housing Status", value: housingStatus, setter: setHousingStatus, options: HOUSING_OPTIONS },
              { label: "Disability Status", value: disabilityStatus, setter: setDisabilityStatus, options: DISABILITY_OPTIONS },
              { label: "Veteran Status", value: veteranStatus, setter: setVeteranStatus, options: VETERAN_OPTIONS },
            ].map(({ label, value, setter, options }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">{label}</label>
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select...</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ))}

            {saveError && (
              <p className="text-sm text-destructive font-medium" role="alert">{saveError}</p>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-full bg-primary text-[var(--on-primary)] font-headline font-bold text-sm hover:bg-primary-dim transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">Saved!</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Applications */}
      <section>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Your Applications
        </h2>

        {appsLoading && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Loading applications...
            </CardContent>
          </Card>
        )}

        {!appsLoading && appsError && (
          <Card>
            <CardContent className="p-4 text-sm text-destructive">{appsError}</CardContent>
          </Card>
        )}

        {!appsLoading && !appsError && applications.length === 0 && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              No applications yet.
            </CardContent>
          </Card>
        )}

        {!appsLoading && !appsError && applications.length > 0 && (
          <div className="flex flex-col gap-3">
            {applications.map((app) => {
              const normalizedStatus = app.status.toLowerCase();
              return (
                <Card key={app.app_id} className="border-border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <p className="font-medium text-foreground text-sm sm:text-base">
                        {app.program_name}
                      </p>
                      <Badge
                        className={cn(
                          "text-[11px] capitalize",
                          statusStyles[normalizedStatus] || "bg-muted text-muted-foreground"
                        )}
                      >
                        {formatStatus(app.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {app.description_plain_language || "No description available."}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>Submitted: {formatDate(app.date_submitted)}</span>
                      <span>Updated: {formatDate(app.last_updated)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
