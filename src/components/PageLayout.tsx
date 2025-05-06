
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

const PageLayout = ({ 
  children, 
  showHeader = true,
  showFooter = true 
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <AppHeader />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <AppFooter />}
    </div>
  );
};

export default PageLayout;
