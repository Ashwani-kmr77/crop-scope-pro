import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout, TrendingUp } from "lucide-react";
import wheatImg from "@/assets/wheat.jpg";
import riceImg from "@/assets/rice.jpg";
import maizeImg from "@/assets/maize.jpg";
import sugarcaneImg from "@/assets/sugarcane.jpg";
import cottonImg from "@/assets/cotton.jpg";

interface PredictionResult {
  yield: number;
  crop: string;
  cropImage: string;
}

interface OptimizationSuggestion {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

const cropImages: Record<string, string> = {
  Rice: riceImg,
  Wheat: wheatImg,
  Maize: maizeImg,
  Sugarcane: sugarcaneImg,
  "Cotton(lint)": cottonImg,
};

export const CropPredictor = ({
  onPredictionComplete,
}: {
  onPredictionComplete: (result: PredictionResult, suggestions: OptimizationSuggestion[]) => void;
}) => {
  const [formData, setFormData] = useState({
    crop: "Rice",
    area: "",
    rainfall: "",
    temperature: "",
    fertilizer: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const generateOptimizations = (
    crop: string,
    area: number,
    rainfall: number,
    temperature: number,
    fertilizer: number,
    predictedYield: number
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
      const fertilizer = parseFloat(formData.fertilizer);

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

      const result: PredictionResult = {
        yield: Math.round(predictedYield * 100) / 100,
        crop: formData.crop,
        cropImage: cropImages[formData.crop] || "",
      };

      const suggestions = generateOptimizations(
        formData.crop,
        area,
        rainfall,
        temperature,
        fertilizer,
        predictedYield
      );

      onPredictionComplete(result, suggestions);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Sprout className="h-5 w-5 text-primary" />
          AI Crop Yield Predictor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crop">Crop Type</Label>
            <Select value={formData.crop} onValueChange={(value) => setFormData({ ...formData, crop: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rice">Rice</SelectItem>
                <SelectItem value="Wheat">Wheat</SelectItem>
                <SelectItem value="Maize">Maize</SelectItem>
                <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                <SelectItem value="Cotton(lint)">Cotton</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area">Area (hectares)</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                placeholder="e.g., 10.5"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
              <Input
                id="rainfall"
                type="number"
                placeholder="e.g., 1200"
                value={formData.rainfall}
                onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Avg Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="e.g., 25.5"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fertilizer">Fertilizer (kg)</Label>
              <Input
                id="fertilizer"
                type="number"
                placeholder="e.g., 500"
                value={formData.fertilizer}
                onChange={(e) => setFormData({ ...formData, fertilizer: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            <TrendingUp className="h-4 w-4 mr-2" />
            {isLoading ? "Analyzing..." : "Predict Yield"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
