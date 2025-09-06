import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Beaker, DollarSign, Calendar, ChevronRight } from "lucide-react";

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

interface CropAdvisoryFormProps {
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

const CropAdvisoryForm = ({ onSubmit, isLoading = false }: CropAdvisoryFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    location: "",
    farmSize: "",
    soilType: "",
    soilPH: "",
    budget: "",
    previousCrop: "",
    farmingExperience: "",
    additionalInfo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Get Your Crop Recommendations</h2>
            <p className="text-xl text-muted-foreground">
              Fill in your farm details to receive personalized AI-powered crop suggestions
            </p>
          </div>

          <Card className="p-8 shadow-card border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Location & Farm Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="w-5 h-5 text-primary" />
                  Farm Location & Size
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location (State/District)</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Punjab, Ludhiana"
                      value={formData.location}
                      onChange={(e) => updateField("location", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Select onValueChange={(value) => updateField("farmSize", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select farm size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt; 2 acres)</SelectItem>
                        <SelectItem value="medium">Medium (2-10 acres)</SelectItem>
                        <SelectItem value="large">Large (&gt; 10 acres)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Soil Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Beaker className="w-5 h-5 text-secondary" />
                  Soil Information
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select onValueChange={(value) => updateField("soilType", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soilPH">Soil pH (if known)</Label>
                    <Input
                      id="soilPH"
                      placeholder="e.g., 6.5"
                      value={formData.soilPH}
                      onChange={(e) => updateField("soilPH", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Budget & Experience */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="w-5 h-5 text-accent-foreground" />
                  Budget & Experience
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Investment Budget</Label>
                    <Select onValueChange={(value) => updateField("budget", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (&lt; ₹50,000)</SelectItem>
                        <SelectItem value="medium">Medium (₹50,000 - ₹2,00,000)</SelectItem>
                        <SelectItem value="high">High (&gt; ₹2,00,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Farming Experience</Label>
                    <Select onValueChange={(value) => updateField("farmingExperience", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (&lt; 2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-10 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (&gt; 10 years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Previous Crop & Additional Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="w-5 h-5 text-primary" />
                  Additional Information
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="previousCrop">Previous Crop (if any)</Label>
                    <Input
                      id="previousCrop"
                      placeholder="e.g., Wheat, Rice, Cotton"
                      value={formData.previousCrop}
                      onChange={(e) => updateField("previousCrop", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any specific requirements, irrigation facilities, market access, etc."
                      value={formData.additionalInfo}
                      onChange={(e) => updateField("additionalInfo", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Analyzing Your Farm..."
                ) : (
                  <>
                    Get AI Recommendations
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CropAdvisoryForm;