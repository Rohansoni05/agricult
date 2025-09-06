import { Button } from "@/components/ui/button";
import { Sprout, Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Sprout className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">CropAdvisor</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Agriculture</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </a>
            <a href="#recommendations" className="text-sm font-medium hover:text-primary transition-colors">
              Get Recommendations
            </a>
            <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Start Analysis
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <nav className="space-y-4">
              <a href="#home" className="block text-sm font-medium hover:text-primary transition-colors">
                Home
              </a>
              <a href="#recommendations" className="block text-sm font-medium hover:text-primary transition-colors">
                Get Recommendations
              </a>
              <a href="#about" className="block text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
              <a href="#contact" className="block text-sm font-medium hover:text-primary transition-colors">
                Contact
              </a>
              <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Start Analysis
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;