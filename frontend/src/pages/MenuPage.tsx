import { Home, List, User, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { label: "Home", to: "/", icon: Home, desc: "Start a new search" },
  { label: "Common Situations", to: "/situations", icon: List, desc: "Browse housing programs" },
  { label: "Profile", to: "/profile", icon: User, desc: "Your applications" },
  { label: "Search Results", to: "/results", icon: MessageSquare, desc: "View conversation" },
];

const MenuPage = () => {
  return (
    <div className="flex-1 flex flex-col px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Navigation</h1>
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-medium text-foreground">{item.label}</span>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default MenuPage;
