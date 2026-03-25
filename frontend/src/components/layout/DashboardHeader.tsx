interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

const DashboardHeader = ({ onMenuToggle }: DashboardHeaderProps) => {
  return (
    <header className="sticky top-0 w-full z-30 bg-white/80 backdrop-blur-xl shadow-editorial flex justify-between items-center px-4 lg:px-8 py-4 font-headline tracking-tight">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-2xl font-extrabold tracking-tighter text-blue-800">Navig<span className="text-primary">Aid</span></span>
      </div>
    </header>
  );
};

export default DashboardHeader;
