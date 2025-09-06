import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CropAdvisoryForm from "@/components/CropAdvisoryForm";
import RecommendationResults from "@/components/RecommendationResults";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  location: string;
  farmSize: string;
  soilType: string;
  soilPH: string;
  budget: string;
  previousCrop: string;
  farmingExperience: string;
  additionalInfo: string;
}

const Index = () => {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    // Simulate AI processing
    toast({
      title: "Processing Your Request",
      description: "Our AI is analyzing your farm conditions...",
    });

    // Simulate processing time
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
      
      toast({
        title: "Analysis Complete!",
        description: "Your personalized crop recommendations are ready.",
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <section id="home">
          <HeroSection />
        </section>
        
        <section id="recommendations">
          <CropAdvisoryForm 
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        </section>
        
        {showResults && (
          <section id="results">
            <RecommendationResults />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <span className="text-primary-foreground font-bold text-lg">🌱</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">CropAdvisor</h3>
                <p className="text-sm text-muted-foreground">Empowering Farmers with AI</p>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered smart advisory system helps small and marginal farmers make informed crop selection decisions, 
              leading to better yields and improved livelihoods.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2024 CropAdvisors. Revolutionizing agriculture through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;