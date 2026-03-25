import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/Logo.png";
import { getStoredUser } from "@/utils/auth";

const navItems = [
  {
    to: "/results",
    label: "History",
    icon: "history",
    matchExact: true,
  },
  {
    to: "/situations",
    label: "Programs",
    icon: "grid_view",
  },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const user = getStoredUser();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 border-r border-slate-200/20 bg-slate-50 flex flex-col py-6 gap-4 z-50 font-body antialiased transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 mb-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={onClose}>
            <img src={logo} alt="NavigAid" className="w-8 h-8 rounded-lg object-contain" />
            <div>
              <h1 className="text-lg font-bold text-slate-800 font-headline">Navig<span className="text-primary">Aid</span></h1>
              <p className="text-xs text-slate-500">Aid Portal</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = item.matchExact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);

            return (
              <Link
                key={`${item.to}-${item.label}`}
                to={item.to}
                onClick={onClose}
                className={`mx-2 px-4 py-3 rounded-xl flex items-center gap-3 transition-transform duration-200 hover:translate-x-1 ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-4 space-y-4">
          <div className="space-y-1">
            <Link
              to={user ? "/profile" : "/login"}
              onClick={onClose}
              className="text-slate-600 px-4 py-2 hover:bg-slate-100 rounded-xl flex items-center gap-3 text-sm transition-transform duration-200 hover:translate-x-1"
            >
              <span className="material-symbols-outlined text-base">person</span>
              Profile
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
