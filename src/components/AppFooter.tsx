
import { Link } from "react-router-dom";

const AppFooter = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full py-6 px-6 mt-8 bg-white border-t">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Zen Zone</h3>
            <p className="text-sm text-muted-foreground">
              Your daily companion for mindfulness and meditation.
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/achievements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Achievements
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Zen Zone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
