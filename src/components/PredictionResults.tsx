import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

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

interface PredictionResultsProps {
  result: PredictionResult;
  suggestions: OptimizationSuggestion[];
}

export const PredictionResults = ({ result, suggestions }: PredictionResultsProps) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Info className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium":
        return "bg-accent/10 text-accent border-accent/30";
      case "low":
        return "bg-primary/10 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Prediction Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {result.cropImage && (
              <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden">
                <img
                  src={result.cropImage}
                  alt={result.crop}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <div className="text-sm text-muted-foreground">Predicted Yield for {result.crop}</div>
              <div className="text-4xl font-bold text-primary">
                {result.yield} <span className="text-xl">tons/hectare</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Based on ML RandomForest model analysis
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">AI Optimization Suggestions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Personalized recommendations to maximize your yield
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${getPriorityColor(
                  suggestion.priority
                )}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getPriorityIcon(suggestion.priority)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-foreground">{suggestion.title}</div>
                      <Badge
                        variant={
                          suggestion.priority === "high"
                            ? "destructive"
                            : suggestion.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
