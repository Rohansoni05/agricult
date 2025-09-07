import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sprout, TrendingUp, CloudRain, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern farming landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium border border-accent/20">
                <Sprout className="w-4 h-4" />
                AI-Powered Agriculture
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Smart Crop.
                <span className="block bg-gradient-harvest text- bg-clip-text">
                  Advisory System
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Empowering farmers with AI-driven insights for optimal crop selection based on soil, weather, and market conditions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                Get Crop Recommendations
              </Button>
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/5">
                Learn More
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Farmers Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">30%</div>
                <div className="text-sm text-muted-foreground">Yield Increase</div>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            <Link to={'/weather'}>
            <Card className="p-6 bg-card/80 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CloudRain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Weather Intelligence</h3>
                  <p className="text-muted-foreground">
                    Real-time weather analysis and climate pattern predictions for optimal planting decisions.
                  </p>
                </div>
              </div>
            </Card>
            </Link>

            <Card className="p-6 bg-card/80 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Sprout className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Soil Analysis</h3>
                  <p className="text-muted-foreground">
                    Comprehensive soil health assessment with pH, nutrient, and composition analysis.
                  </p>
                </div>
              </div>
            </Card>
<Link to={"/crop-price"}>
            <Card className="p-6 bg-card/80 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-glow transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Market Insights</h3>
                  <p className="text-muted-foreground">
                    Current market prices and demand forecasting to maximize profitability.
                  </p>
                </div>
              </div>
            </Card>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;