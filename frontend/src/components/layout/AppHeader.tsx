import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
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
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
      <Link to="/" className="flex items-center gap-2">
        <img src={Logo} alt="HousingAid Logo" className="w-12 h-12" />
        <span className="font-display font-semibold text-foreground text-lg">HousingAid</span>
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open menu">
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
    </header>
  );
};

export default AppHeader;
