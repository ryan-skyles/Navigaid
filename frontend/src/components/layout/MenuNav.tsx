import { Home, List, User, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Home", to: "/", icon: Home },
  { label: "Common Situations", to: "/situations", icon: List },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Search Results", to: "/results", icon: MessageSquare },
];

const MenuNav = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-col py-2">
      {menuItems.map((item) => {
        const active = location.pathname === item.to;
        return (
          <SheetClose key={item.to} asChild>
            <Link
              to={item.to}
              className={cn(
                "flex items-center gap-3 px-6 py-4 text-base font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          </SheetClose>
        );
      })}
    </nav>
  );
};

export default MenuNav;
