import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Droplets, Thermometer, DollarSign, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

interface CropRecommendation {
  name: string;
  profitabilityScore: number;
  suitabilityScore: number;
  expectedYield: string;
  marketPrice: string;
  investmentRequired: string;
  growthDuration: string;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  challenges: string[];
}

interface WeatherData {
  temperature: string;
  rainfall: string;
  humidity: string;
  forecast: string;
}

interface MarketData {
  trend: "up" | "down" | "stable";
  currentPrice: string;
  demandLevel: "low" | "medium" | "high";
  seasonalFactor: string;
}

interface RecommendationResultsProps {
  recommendations: CropRecommendation[];
  weatherData: WeatherData;
  marketData: MarketData;
  soilAnalysis: {
    suitability: string;
    recommendations: string[];
  };
}

const mockData: RecommendationResultsProps = {
  recommendations: [
    {
      name: "Wheat",
      profitabilityScore: 85,
      suitabilityScore: 92,
      expectedYield: "40-45 quintals/acre",
      marketPrice: "₹2,200-2,400/quintal",
      investmentRequired: "₹15,000-20,000/acre",
      growthDuration: "120-140 days",
      riskLevel: "low",
      reasons: [
        "Excellent soil compatibility with your clay-loam soil",
        "Favorable weather conditions for current season",
        "Strong market demand and stable pricing",
        "Low water requirement matches local conditions"
      ],
      challenges: [
        "Monitor for wheat rust during humid periods",
        "Ensure proper fertilizer timing"
      ]
    },
    {
      name: "Mustard",
      profitabilityScore: 78,
      suitabilityScore: 88,
      expectedYield: "15-18 quintals/acre",
      marketPrice: "₹5,500-6,200/quintal",
      investmentRequired: "₹8,000-12,000/acre",
      growthDuration: "90-110 days",
      riskLevel: "medium",
      reasons: [
        "High market value and good demand",
        "Lower water requirement",
        "Good rotation crop for soil health",
        "Early harvest allows for second crop"
      ],
      challenges: [
        "Price volatility in market",
        "Pest management required"
      ]
    },
    {
      name: "Chickpea",
      profitabilityScore: 72,
      suitabilityScore: 80,
      expectedYield: "18-22 quintals/acre",
      marketPrice: "₹4,800-5,400/quintal",
      investmentRequired: "₹12,000-16,000/acre",
      growthDuration: "100-120 days",
      riskLevel: "medium",
      reasons: [
        "Good protein content demand",
        "Nitrogen fixation benefits soil",
        "Moderate water requirement",
        "Good export potential"
      ],
      challenges: [
        "Susceptible to wilt disease",
        "Weather sensitivity during flowering"
      ]
    }
  ],
  weatherData: {
    temperature: "18-28°C",
    rainfall: "Expected 200-300mm",
    humidity: "65-75%",
    forecast: "Favorable for Rabi crops with adequate rainfall expected"
  },
  marketData: {
    trend: "up",
    currentPrice: "₹2,300/quintal (Wheat)",
    demandLevel: "high",
    seasonalFactor: "Peak demand season approaching"
  },
  soilAnalysis: {
    suitability: "Excellent for cereal crops, good drainage",
    recommendations: [
      "Add organic matter to improve soil structure",
      "Consider soil testing for micronutrients",
      "Maintain pH between 6.5-7.5 for optimal yield"
    ]
  }
};

const RecommendationResults = ({ 
  recommendations = mockData.recommendations,
  weatherData = mockData.weatherData,
  marketData = mockData.marketData,
  soilAnalysis = mockData.soilAnalysis
}: Partial<RecommendationResultsProps>) => {
  
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Your Personalized Crop Recommendations</h2>
            <p className="text-xl text-muted-foreground">
              AI-analyzed recommendations based on your farm conditions
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Thermometer className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Weather Outlook</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temperature:</span>
                  <span>{weatherData.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rainfall:</span>
                  <span>{weatherData.rainfall}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span>{weatherData.humidity}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{weatherData.forecast}</p>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold">Market Trends</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Trend:</span>
                  <div className="flex items-center gap-1">
                    {marketData.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={marketData.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {marketData.trend.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price:</span>
                  <span>{marketData.currentPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Demand:</span>
                  <Badge variant={marketData.demandLevel === "high" ? "default" : "secondary"}>
                    {marketData.demandLevel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">{marketData.seasonalFactor}</p>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Droplets className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold">Soil Analysis</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">{soilAnalysis.suitability}</p>
                <div className="space-y-1">
                  {soilAnalysis.recommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Crop Recommendations */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Recommended Crops</h3>
            
            {recommendations.map((crop, index) => (
              <Card key={index} className="p-8 shadow-card border border-border/50 hover:shadow-glow transition-all duration-300">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <h4 className="text-2xl font-bold">{crop.name}</h4>
                        <Badge className={getRiskColor(crop.riskLevel)}>
                          {crop.riskLevel} risk
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Rank</div>
                        <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Profitability Score</span>
                          <span className="text-sm font-bold">{crop.profitabilityScore}/100</span>
                        </div>
                        <Progress value={crop.profitabilityScore} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Suitability Score</span>
                          <span className="text-sm font-bold">{crop.suitabilityScore}/100</span>
                        </div>
                        <Progress value={crop.suitabilityScore} className="h-2" />
                      </div>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="font-medium">Expected Yield:</span>
                          <span>{crop.expectedYield}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-accent-foreground" />
                          <span className="font-medium">Market Price:</span>
                          <span>{crop.marketPrice}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-secondary" />
                          <span className="font-medium">Investment:</span>
                          <span>{crop.investmentRequired}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="font-medium">Duration:</span>
                          <span>{crop.growthDuration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reasons & Challenges */}
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Why This Crop?
                      </h5>
                      <ul className="space-y-2">
                        {crop.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        Considerations
                      </h5>
                      <ul className="space-y-2">
                        {crop.challenges.map((challenge, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationResults;