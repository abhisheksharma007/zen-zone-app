
import { Clock } from "lucide-react";

const AppHeader = () => {
  return (
    <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-sm rounded-lg mb-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6 text-zenpurple-500" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-zenblue-500 to-zenpurple-500 text-transparent bg-clip-text">
          Zen Zone
        </h1>
      </div>
      <div className="text-sm text-muted-foreground">Break the scroll cycle</div>
    </header>
  );
};

export default AppHeader;
