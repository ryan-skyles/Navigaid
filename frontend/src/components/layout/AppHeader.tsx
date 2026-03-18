import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MenuNav from "@/components/layout/MenuNav";
import Logo from "@/assets/Logo.png";

const AppHeader = () => {
  const location = useLocation();

  const navItems = [
    { to: "/situations", label: "Common Situations" },
    { to: "/profile", label: "Profile" },
    { to: "/results", label: "Search Results" },
  ] as const;

  return (
    <header className="app-header fixed inset-x-0 top-0 relative isolate border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        <Link to="/" className="group flex items-center gap-2">
          <div className="relative">
            <img
              src={Logo}
              alt="HousingAid Logo"
              className="w-16 h-16 rounded-2xl transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </div>
          <img
            src="/NavigaidTitle.png"
            alt="Navigaid page title"
            className="h-12 w-auto select-none"
            draggable={false}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-2 rounded-2xl border border-border/60 bg-card/50 px-2 py-2 shadow-sm">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  "relative rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  active
                    ? "bg-primary/10 text-primary shadow-inner"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/60",
                ].join(" ")}
              >
                {item.label}
                {active && (
                  <span className="pointer-events-none absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-primary/70" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="rounded-xl border border-border/60 bg-card/40 shadow-sm hover:bg-card/70"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="p-6 pb-2">
                <SheetTitle className="font-display">Menu</SheetTitle>
              </SheetHeader>
              <MenuNav />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
