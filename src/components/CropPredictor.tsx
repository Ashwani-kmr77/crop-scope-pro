import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, MapPin, Droplets, Thermometer, MapPinned } from "lucide-react";
import wheatImg from "@/assets/wheat.jpg";
import riceImg from "@/assets/rice.jpg";
import maizeImg from "@/assets/maize.jpg";
import sugarcaneImg from "@/assets/sugarcane.jpg";
import cottonImg from "@/assets/cotton.jpg";

interface PredictionResult {
  yield: number;
  crop: string;
  cropImage: string;
  fertilizerRecommendations?: FertilizerRecommendation[];
}

interface OptimizationSuggestion {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface FertilizerRecommendation {
  name: string;
  amount: number;
  unit: string;
  purpose: string;
}

interface LocationData {
  name: string;
  rainfall: number;
  avgTemp: number;
  soilType: string;
}

const cropImages: Record<string, string> = {
  Rice: riceImg,
  Wheat: wheatImg,
  Maize: maizeImg,
  Sugarcane: sugarcaneImg,
  "Cotton(lint)": cottonImg,
};

const locationData: LocationData[] = [
  { name: "Hamirpur", rainfall: 850, avgTemp: 26, soilType: "Sandy Loam" },
  { name: "Kanpur", rainfall: 780, avgTemp: 27, soilType: "Alluvial" },
  { name: "Gorakhpur", rainfall: 1200, avgTemp: 26, soilType: "Clay Loam" },
  { name: "Greater Noida", rainfall: 720, avgTemp: 25, soilType: "Alluvial" },
  { name: "Lucknow", rainfall: 900, avgTemp: 26, soilType: "Sandy Clay" },
  { name: "Jhansi", rainfall: 680, avgTemp: 28, soilType: "Red Sandy" },
];

const fertilizerTypes = [
  { value: "urea", label: "Urea (46-0-0)", npk: "46-0-0" },
  { value: "dap", label: "DAP (18-46-0)", npk: "18-46-0" },
  { value: "mop", label: "MOP (0-0-60)", npk: "0-0-60" },
  { value: "npk", label: "NPK (19-19-19)", npk: "19-19-19" },
  { value: "ssp", label: "SSP (0-16-0)", npk: "0-16-0" },
  { value: "organic", label: "Organic Compost", npk: "Variable" },
];

export const CropPredictor = ({
  onPredictionComplete,
}: {
  onPredictionComplete: (result: PredictionResult, suggestions: OptimizationSuggestion[]) => void;
}) => {
  const [formData, setFormData] = useState({
    location: "",
    crop: "Rice",
    area: "",
    rainfall: "",
    temperature: "",
    soilType: "",
    fertilizerType: "urea",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleLocationChange = (location: string) => {
    const locationInfo = locationData.find((loc) => loc.name === location);
    if (locationInfo) {
      setFormData({
        ...formData,
        location,
        rainfall: locationInfo.rainfall.toString(),
        temperature: locationInfo.avgTemp.toString(),
        soilType: locationInfo.soilType,
      });
    }
  };

  const calculateFertilizerRecommendations = (
    crop: string,
    area: number,
    selectedFertilizer: string
  ): FertilizerRecommendation[] => {
    const recommendations: FertilizerRecommendation[] = [];
    
    // Base recommendations per hectare
    const baseN = crop === "Rice" ? 120 : crop === "Wheat" ? 150 : crop === "Maize" ? 140 : 100;
    const baseP = crop === "Rice" ? 60 : crop === "Wheat" ? 60 : crop === "Maize" ? 70 : 50;
    const baseK = crop === "Rice" ? 40 : crop === "Wheat" ? 40 : crop === "Maize" ? 50 : 40;

    // Selected fertilizer gets priority
    const selectedFertInfo = fertilizerTypes.find(f => f.value === selectedFertilizer);
    if (selectedFertInfo) {
      const amount = Math.round((baseN * 0.4) * area);
      recommendations.push({
        name: selectedFertInfo.label,
        amount,
        unit: "kg",
        purpose: "Primary nutrient source (selected)",
      });
    }

    // Add complementary fertilizers
    recommendations.push(
      {
        name: "DAP (18-46-0)",
        amount: Math.round((baseP / 0.46) * area),
        unit: "kg",
        purpose: "Phosphorus for root development",
      },
      {
        name: "MOP (0-0-60)",
        amount: Math.round((baseK / 0.60) * area),
        unit: "kg",
        purpose: "Potassium for disease resistance",
      },
      {
        name: "Urea (46-0-0)",
        amount: Math.round(((baseN * 0.6) / 0.46) * area),
        unit: "kg",
        purpose: "Nitrogen for vegetative growth",
      },
      {
        name: "Zinc Sulphate",
        amount: Math.round(25 * area),
        unit: "kg",
        purpose: "Micronutrient supplementation",
      }
    );

    return recommendations;
  };

  const generateOptimizations = (
    crop: string,
    area: number,
    rainfall: number,
    temperature: number,
    fertilizer: number,
    predictedYield: number,
    soilType: string
  ): OptimizationSuggestion[] => {
    const suggestions: OptimizationSuggestion[] = [];

    // Rainfall-based suggestions
    if (rainfall < 800) {
      suggestions.push({
        title: "Implement Drip Irrigation",
        description: `Low rainfall detected (${rainfall}mm). Install drip irrigation to improve water efficiency by 40-60% and boost yields.`,
        priority: "high",
      });
    } else if (rainfall > 2500) {
      suggestions.push({
        title: "Improve Drainage Systems",
        description: `High rainfall (${rainfall}mm) detected. Install proper drainage to prevent waterlogging and root diseases.`,
        priority: "high",
      });
    }

    // Temperature-based suggestions
    if (temperature < 20 && (crop === "Rice" || crop === "Maize")) {
      suggestions.push({
        title: "Consider Cold-Resistant Varieties",
        description: `Temperature ${temperature}°C is below optimal. Switch to cold-resistant ${crop.toLowerCase()} varieties for better yields.`,
        priority: "medium",
      });
    } else if (temperature > 35) {
      suggestions.push({
        title: "Apply Shade Nets & Mulching",
        description: `High temperature (${temperature}°C) can stress crops. Use shade nets and mulching to reduce heat stress.`,
        priority: "high",
      });
    }

    // Fertilizer optimization
    const fertilizerPerHectare = fertilizer / area;
    if (fertilizerPerHectare < 100) {
      suggestions.push({
        title: "Increase Fertilizer Application",
        description: `Current rate is ${Math.round(fertilizerPerHectare)} kg/ha. Increase to 150-200 kg/ha with soil testing for optimal nutrient balance.`,
        priority: "high",
      });
    } else if (fertilizerPerHectare > 300) {
      suggestions.push({
        title: "Reduce Fertilizer to Prevent Burning",
        description: `Over-fertilization detected (${Math.round(fertilizerPerHectare)} kg/ha). Reduce by 30% to prevent nutrient burn and save costs.`,
        priority: "medium",
      });
    }

    // Crop-specific suggestions
    if (crop === "Wheat" && temperature > 30) {
      suggestions.push({
        title: "Adjust Wheat Planting Schedule",
        description: "High temperature affects wheat. Plant earlier (Oct-Nov) to avoid heat stress during grain filling.",
        priority: "medium",
      });
    }

    if (crop === "Rice" && rainfall < 1000) {
      suggestions.push({
        title: "Switch to SRI Method",
        description: "System of Rice Intensification (SRI) reduces water needs by 25-30% while maintaining or increasing yields.",
        priority: "medium",
      });
    }

    // Yield-based suggestions
    if (predictedYield < 2) {
      suggestions.push({
        title: "Conduct Comprehensive Soil Testing",
        description: "Low predicted yield indicates possible soil deficiencies. Test for NPK, micronutrients, and pH levels.",
        priority: "high",
      });
    }

    // Area-based suggestion
    if (area > 50) {
      suggestions.push({
        title: "Implement Precision Agriculture",
        description: `With ${area} hectares, invest in GPS-guided equipment and variable rate technology for optimized input application.`,
        priority: "low",
      });
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate ML prediction using RandomForest logic
    setTimeout(() => {
      const area = parseFloat(formData.area);
      const rainfall = parseFloat(formData.rainfall);
      const temperature = parseFloat(formData.temperature);
      
      // Calculate fertilizer based on crop and area
      const baseN = formData.crop === "Rice" ? 120 : formData.crop === "Wheat" ? 150 : formData.crop === "Maize" ? 140 : 100;
      const fertilizer = baseN * area;

      // Simplified RandomForest-like prediction
      let baseYield = 1.5;
      
      // Crop-specific base yields
      const cropMultipliers: Record<string, number> = {
        Rice: 1.2,
        Wheat: 1.1,
        Maize: 1.0,
        Sugarcane: 3.5,
        "Cotton(lint)": 0.5,
      };

      baseYield *= cropMultipliers[formData.crop] || 1.0;

      // Factor in rainfall
      if (rainfall > 1000 && rainfall < 2000) {
        baseYield *= 1.3;
      } else if (rainfall < 800) {
        baseYield *= 0.7;
      }

      // Factor in temperature
      if (temperature > 20 && temperature < 30) {
        baseYield *= 1.2;
      } else if (temperature < 15 || temperature > 35) {
        baseYield *= 0.8;
      }

      // Factor in fertilizer
      const fertilizerPerHectare = fertilizer / area;
      if (fertilizerPerHectare > 100 && fertilizerPerHectare < 250) {
        baseYield *= 1.15;
      } else if (fertilizerPerHectare < 50) {
        baseYield *= 0.85;
      }

      const predictedYield = Math.max(0.1, baseYield * (0.9 + Math.random() * 0.2));

      const fertilizerRecommendations = calculateFertilizerRecommendations(
        formData.crop,
        area,
        formData.fertilizerType
      );

      const result: PredictionResult = {
        yield: Math.round(predictedYield * 10) / 10,
        crop: formData.crop,
        cropImage: cropImages[formData.crop] || "",
        fertilizerRecommendations,
      };

      const optimizations = generateOptimizations(
        formData.crop,
        area,
        rainfall,
        temperature,
        fertilizer,
        predictedYield,
        formData.soilType
      );

      onPredictionComplete(result, optimizations);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full shadow-xl border-0 overflow-hidden bg-gradient-card">
      <CardHeader className="relative pb-8 pt-8 px-8 bg-gradient-hero border-b border-white/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        <div className="relative">
          <CardTitle className="flex items-center gap-3 text-white text-2xl font-bold">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm ring-2 ring-white/30">
              <Sprout className="h-7 w-7 text-white" />
            </div>
            AI Crop Yield Predictor
          </CardTitle>
          <p className="text-white/90 mt-3 text-base leading-relaxed max-w-2xl">
            Advanced machine learning predictions powered by RandomForest algorithm for precision agriculture
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Section */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-primary/20 shadow-soft hover:shadow-md transition-all duration-300 space-y-5">
            <div className="flex items-center gap-3 pb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Location Details</h3>
            </div>
            <div>
              <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium mb-3">
                <MapPinned className="h-4 w-4 text-primary" />
                District / Location
              </Label>
              <Select value={formData.location} onValueChange={handleLocationChange}>
                <SelectTrigger id="location" className="h-12 bg-background border-border/60 hover:border-primary/40 transition-colors">
                  <SelectValue placeholder="Choose your district" />
                </SelectTrigger>
                <SelectContent>
                  {locationData.map((location) => (
                    <SelectItem key={location.name} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Farm Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="crop" className="text-sm font-medium">Crop Type</Label>
              <Select value={formData.crop} onValueChange={(value) => setFormData({ ...formData, crop: value })}>
                <SelectTrigger id="crop" className="h-12 bg-background border-border/60 hover:border-primary/40 transition-colors">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rice">🌾 Rice</SelectItem>
                  <SelectItem value="Wheat">🌾 Wheat</SelectItem>
                  <SelectItem value="Maize">🌽 Maize</SelectItem>
                  <SelectItem value="Sugarcane">🎋 Sugarcane</SelectItem>
                  <SelectItem value="Cotton(lint)">🌿 Cotton</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="area" className="text-sm font-medium">Cultivation Area</Label>
              <div className="relative">
                <Input
                  id="area"
                  type="number"
                  step="0.1"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Enter area"
                  required
                  className="h-12 bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-colors pr-20"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  hectares
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="rainfall" className="flex items-center gap-2 text-sm font-medium">
                <Droplets className="h-4 w-4 text-secondary" />
                Annual Rainfall
              </Label>
              <div className="relative">
                <Input
                  id="rainfall"
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  placeholder="Auto-filled"
                  required
                  className="h-12 bg-background border-border/60 hover:border-secondary/40 focus:border-secondary transition-colors pr-16"
                  disabled={!formData.location}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  mm
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="temperature" className="flex items-center gap-2 text-sm font-medium">
                <Thermometer className="h-4 w-4 text-accent" />
                Avg. Temperature
              </Label>
              <div className="relative">
                <Input
                  id="temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="Auto-filled"
                  required
                  className="h-12 bg-background border-border/60 hover:border-accent/40 focus:border-accent transition-colors pr-12"
                  disabled={!formData.location}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  °C
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="soilType" className="text-sm font-medium">Soil Type</Label>
              <Input
                id="soilType"
                type="text"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                placeholder="Auto-filled from location"
                required
                className="h-12 bg-background border-border/60 hover:border-primary/40 focus:border-primary transition-colors"
                disabled={!formData.location}
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="fertilizerType" className="text-sm font-medium">Primary Fertilizer</Label>
              <Select 
                value={formData.fertilizerType} 
                onValueChange={(value) => setFormData({ ...formData, fertilizerType: value })}
              >
                <SelectTrigger id="fertilizerType" className="h-12 bg-background border-border/60 hover:border-primary/40 transition-colors">
                  <SelectValue placeholder="Select fertilizer" />
                </SelectTrigger>
                <SelectContent>
                  {fertilizerTypes.map((fertilizer) => (
                    <SelectItem key={fertilizer.value} value={fertilizer.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{fertilizer.label}</span>
                        <span className="text-xs text-muted-foreground ml-2">NPK: {fertilizer.npk}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 bg-gradient-hero hover:opacity-90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] text-base font-semibold relative overflow-hidden group"
            disabled={isLoading || !formData.location}
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3" />
                <span className="relative">Analyzing with AI...</span>
              </>
            ) : (
              <>
                <Sprout className="mr-3 h-5 w-5 relative" />
                <span className="relative">Generate Predictions & Recommendations</span>
              </>
            )}
          </Button>
          
          {!formData.location && (
            <p className="text-center text-sm text-muted-foreground">
              Please select a location to enable prediction
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
