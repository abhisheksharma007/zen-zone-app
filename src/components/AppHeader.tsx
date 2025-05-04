
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const AppHeader = () => {
  const { user, isSubscribed, subscription } = useAuth();
  
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-sm rounded-lg mb-6">
      <div className="flex items-center gap-2">
        <Link to="/">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-zenpurple-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-zenblue-500 to-zenpurple-500 text-transparent bg-clip-text">
              Zen Zone
            </h1>
          </div>
        </Link>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Home
        </Link>
        <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Pricing
        </Link>
        {isSubscribed && subscription?.subscription_tier?.price > 0 && (
          <Link to="/achievements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Achievements
          </Link>
        )}
      </nav>
      
      <div className="flex items-center gap-2">
        {user ? (
          <Link to="/account">
            <Button variant="outline" size="sm">
              Account
            </Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
