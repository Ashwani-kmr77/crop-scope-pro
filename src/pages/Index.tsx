import { useState } from "react";
import { Leaf, Activity, TrendingUp, AlertCircle } from "lucide-react";
import { WeatherWidget } from "@/components/WeatherWidget";
import { IoTSensors } from "@/components/IoTSensors";
import { CropPredictor } from "@/components/CropPredictor";
import { PredictionResults } from "@/components/PredictionResults";
import { StatsCard } from "@/components/StatsCard";

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

const Index = () => {
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState<OptimizationSuggestion[]>([]);

  const handlePredictionComplete = (result: PredictionResult, suggestions: OptimizationSuggestion[]) => {
    setPredictionResult(result);
    setOptimizationSuggestions(suggestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AgriSmart</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Agricultural Intelligence</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            title="Farm Health Score"
            value="87%"
            subtitle="Excellent condition"
            icon={Activity}
            trend="up"
          />
          <StatsCard
            title="Active Sensors"
            value="4/4"
            subtitle="All systems online"
            icon={TrendingUp}
            trend="neutral"
          />
          <StatsCard
            title="Avg Yield Prediction"
            value={predictionResult ? `${predictionResult.yield}` : "—"}
            subtitle="Tons per hectare"
            icon={Leaf}
            trend="up"
          />
          <StatsCard
            title="Alerts"
            value="2"
            subtitle="Requires attention"
            icon={AlertCircle}
            trend="down"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Crop Predictor */}
            <CropPredictor onPredictionComplete={handlePredictionComplete} />

            {/* Prediction Results */}
            {predictionResult && (
              <PredictionResults result={predictionResult} suggestions={optimizationSuggestions} />
            )}

            {/* IoT Sensors */}
            <IoTSensors />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <WeatherWidget />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 AgriSmart. Powered by ML & Real-time APIs</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
