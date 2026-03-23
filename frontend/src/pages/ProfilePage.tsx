import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Application = {
  app_id: number;
  date_submitted: string | null;
  status: string;
  last_updated: string | null;
  program_name: string;
  description_plain_language: string | null;
};

type Client = {
  client_id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type ProfileResponse = {
  client: Client;
  applications: Application[];
};

const statusStyles: Record<string, string> = {
  approved: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  waitlist: "bg-neutral text-neutral-foreground",
  denied: "bg-destructive text-destructive-foreground",
};

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

const ProfilePage = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // temporary hardcoded user
  const clientId = 2;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/clients/${clientId}/profile`);

        if (!response.ok) {
          throw new Error("Failed to load profile data.");
        }

        const data: ProfileResponse = await response.json();
        setClient(data.client);
        setApplications(data.applications);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [clientId]);

  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-6 max-w-3xl mx-auto w-full">
      <Card className="border-border shadow-sm">
  <CardContent className="p-6 flex items-center gap-4">
    <Avatar className="w-16 h-16 bg-primary/10 shrink-0">
      <AvatarFallback className="bg-primary/10 text-primary">
        <User className="w-8 h-8" />
      </AvatarFallback>
    </Avatar>

    <div className="min-w-0">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
        {loading ? "Loading..." : `${client?.firstName ?? ""} ${client?.lastName ?? ""}`}
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground mt-1">
        Housing applicant
      </p>

      {client?.email && (
        <div className="flex items-center gap-2 mt-2 text-sm sm:text-base text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span className="truncate">{client.email}</span>
        </div>
      )}
    </div>
  </CardContent>
</Card>

      <section>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">
          Your Applications
        </h2>

        {loading && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Loading applications...
            </CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card>
            <CardContent className="p-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {!loading && !error && applications.length === 0 && (
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              No applications found.
            </CardContent>
          </Card>
        )}

        {!loading && !error && applications.length > 0 && (
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