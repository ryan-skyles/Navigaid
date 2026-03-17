import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  approved: "bg-success text-success-foreground",
  pending: "bg-warning text-warning-foreground",
  waitlist: "bg-neutral text-neutral-foreground",
};

// Mock data — will be replaced with backend data
const mockApplications = [
  {
    id: "1",
    program: "Greenfield Apartments",
    description: "Affordable Housing – 2BR unit, $850/mo",
    status: "approved",
  },
  {
    id: "2",
    program: "Section 8 Voucher",
    description: "Housing Choice Voucher Program",
    status: "pending",
  },
  {
    id: "3",
    program: "Riverside Community",
    description: "Senior & Disability Housing – 1BR",
    status: "waitlist",
  },
];

const ProfilePage = () => {
  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-6">
      {/* User info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14 bg-primary/10">
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="w-7 h-7" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Alex Johnson</h1>
          <p className="text-sm text-muted-foreground">Housing applicant</p>
        </div>
      </div>

      {/* Applications */}
      <section>
        <h2 className="font-display text-lg font-semibold text-foreground mb-3">Your Applications</h2>
        <div className="flex flex-col gap-3">
          {mockApplications.map((app) => (
            <Card key={app.id} className="border-border">
              <CardContent className="p-4 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{app.program}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{app.description}</p>
                  <Badge className={cn("mt-2 text-[11px] capitalize", statusStyles[app.status])}>
                    {app.status}
                  </Badge>
                </div>
                <button className="text-primary hover:text-primary/80 shrink-0 mt-1" aria-label="View details">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
