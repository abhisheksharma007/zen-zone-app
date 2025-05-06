
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  label?: string;
  to?: string;
}

const BackButton = ({ label = "Back", to }: BackButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="mb-4" 
      onClick={handleClick}
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};

export default BackButton;
