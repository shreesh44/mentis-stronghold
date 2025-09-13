import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, BookOpen, Calendar, LogIn } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">MentiSphere</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            to="/emotion-mirror"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1 ${
              isActive("/emotion-mirror") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Emotion Mirror</span>
          </Link>
          <Link
            to="/blog"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1 ${
              isActive("/blog") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Blog</span>
          </Link>
          <Link
            to="/therapy"
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1 ${
              isActive("/therapy") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Therapy</span>
          </Link>
        </div>

        <Button asChild variant="default" className="bg-gradient-hero shadow-soft">
          <Link to="/auth" className="flex items-center space-x-1">
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;