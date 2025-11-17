import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, CheckCircle, Info, Leaf } from "lucide-react";

interface FertilizerRecommendation {
  name: string;
  amount: number;
  unit: string;
  purpose: string;
}

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
    <div className="space-y-8 animate-in fade-in duration-700">
      <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-card">
        <CardHeader className="relative pb-6 pt-8 px-8 bg-gradient-success border-b border-white/20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImRvdHMiIHg9IjAiIHk9IjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEuNSIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2RvdHMpIi8+PC9zdmc+')] opacity-60"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm ring-2 ring-white/30">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-white text-2xl font-bold">AI Prediction Results</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {result.cropImage && (
              <div className="relative w-full md:w-56 h-40 rounded-2xl overflow-hidden shadow-xl ring-4 ring-primary/20 group">
                <img
                  src={result.cropImage}
                  alt={result.crop}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="text-sm font-semibold text-foreground">{result.crop}</span>
                </div>
              </div>
            )}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Predicted Yield
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl font-bold bg-gradient-success bg-clip-text text-transparent">
                    {result.yield}
                  </span>
                  <span className="text-2xl font-semibold text-muted-foreground">tons/ha</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-success/5 border border-success/20 rounded-xl">
                <div className="relative">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
                  </span>
                </div>
                <p className="text-sm font-medium text-success-foreground">
                  Powered by RandomForest ML Model
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {result.fertilizerRecommendations && result.fertilizerRecommendations.length > 0 && (
        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-card">
          <CardHeader className="relative pb-6 pt-8 px-8 bg-gradient-to-r from-secondary/20 via-secondary/10 to-accent/10 border-b border-border/30">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0ic3F1YXJlcyIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNzcXVhcmVzKSIvPjwvc3ZnPg==')] opacity-50"></div>
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-secondary/20 rounded-xl ring-2 ring-secondary/30">
                  <Leaf className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-foreground text-2xl font-bold">Fertilizer Recommendations</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Precision nutrient plan for optimal crop performance
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {result.fertilizerRecommendations.map((fertilizer, index) => (
                <div
                  key={index}
                  className="group relative p-5 rounded-xl bg-gradient-to-br from-muted/40 to-muted/20 border border-border/60 hover:border-secondary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-secondary">{index + 1}</span>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-base text-foreground pr-10 leading-tight">
                      {fertilizer.name}
                    </h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-secondary">{fertilizer.amount}</span>
                      <span className="text-sm font-semibold text-muted-foreground uppercase">{fertilizer.unit}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {fertilizer.purpose}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-card">
        <CardHeader className="relative pb-6 pt-8 px-8 bg-gradient-to-r from-accent/15 via-accent/8 to-primary/10 border-b border-border/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImhleGFnb25zIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNMjggNjZMMCA1MFYxOEwyOCAyTDU2IDE4VjUwTDI4IDY2TDI4IDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI4IDBMMiAxNFYzNEwyOCA0OEw1NCAzNFYxNHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNoZXhhZ29ucykiLz48L3N2Zz4=')] opacity-40"></div>
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 bg-accent/20 rounded-xl ring-2 ring-accent/30">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-foreground text-2xl font-bold">Optimization Suggestions</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 font-medium">
                AI-powered insights to maximize your agricultural productivity
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getPriorityColor(
                  suggestion.priority
                )}`}
              >
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 mt-1 p-2 rounded-lg ${
                    suggestion.priority === 'high' 
                      ? 'bg-destructive/20' 
                      : suggestion.priority === 'medium' 
                      ? 'bg-accent/20' 
                      : 'bg-primary/20'
                  }`}>
                    {getPriorityIcon(suggestion.priority)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-bold text-base leading-tight">{suggestion.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold uppercase shrink-0 ${
                          suggestion.priority === 'high'
                            ? 'border-destructive/40 text-destructive'
                            : suggestion.priority === 'medium'
                            ? 'border-accent/40 text-accent'
                            : 'border-primary/40 text-primary'
                        }`}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed">{suggestion.description}</p>
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
