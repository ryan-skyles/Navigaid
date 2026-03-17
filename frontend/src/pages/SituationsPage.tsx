import { MapPin, Home, Accessibility, Ticket, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const programs = [
  {
    id: "affordable",
    name: "Affordable Housing",
    icon: Home,
    summary: "Income-based rental programs that cap your rent at 30% of income.",
    details:
      "Affordable housing programs are government-subsidized residences that set rent limits based on your household income. Eligible tenants typically pay no more than 30% of their adjusted gross income toward rent. Programs vary by city and state — applications may involve income verification, background checks, and waitlists. Contact your local housing authority to learn more.",
  },
  {
    id: "disability",
    name: "Disability Benefits",
    icon: Accessibility,
    summary: "Housing assistance for individuals with physical or developmental disabilities.",
    details:
      "If you or a household member has a qualifying disability, you may be eligible for priority placement, accessible unit modifications, or supplemental vouchers. Programs like Section 811 provide affordable housing paired with supportive services. Documentation from a medical provider is typically required during application.",
  },
  {
    id: "vouchers",
    name: "Housing Vouchers",
    icon: Ticket,
    summary: "Section 8 and similar vouchers that help pay for private-market rentals.",
    details:
      "Housing Choice Vouchers (Section 8) let you choose a privately-owned rental that meets program standards. The voucher covers a portion of the rent, and you pay the difference. Eligibility is based on income, family size, and citizenship status. Waitlists can be long — it's important to apply early and at multiple housing authorities.",
  },
];

const SituationsPage = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="w-4 h-4" />
        <span className="text-sm font-medium">Your Location</span>
        <span className="text-sm text-primary ml-1">United States</span>
      </div>

      <h1 className="font-display text-xl font-bold text-foreground">Common Situations</h1>
      <p className="text-sm text-muted-foreground -mt-3">
        Explore programs you may qualify for.
      </p>

      <div className="flex flex-col gap-3">
        {programs.map((prog) => {
          const isOpen = expanded === prog.id;
          return (
            <Card
              key={prog.id}
              className="cursor-pointer border-border hover:border-primary/20 transition-all"
              onClick={() => setExpanded(isOpen ? null : prog.id)}
            >
              <CardHeader className="flex flex-row items-start gap-3 pb-2 p-4">
                <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                  <prog.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold">{prog.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{prog.summary}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground shrink-0 transition-transform mt-1",
                    isOpen && "rotate-180"
                  )}
                />
              </CardHeader>
              {isOpen && (
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="text-sm text-foreground leading-relaxed">{prog.details}</p>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default SituationsPage;
