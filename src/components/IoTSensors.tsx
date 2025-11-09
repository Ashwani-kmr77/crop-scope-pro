import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Droplet, Thermometer, FlaskConical } from "lucide-react";

interface SensorData {
  id: string;
  name: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  status: "good" | "warning" | "critical";
  threshold: { min: number; max: number };
}

export const IoTSensors = () => {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "soil-temp",
      name: "Soil Temperature",
      value: 24,
      unit: "°C",
      icon: <Thermometer className="h-5 w-5" />,
      status: "good",
      threshold: { min: 15, max: 30 },
    },
    {
      id: "soil-moisture",
      name: "Soil Moisture",
      value: 65,
      unit: "%",
      icon: <Droplet className="h-5 w-5" />,
      status: "good",
      threshold: { min: 40, max: 80 },
    },
    {
      id: "air-humidity",
      name: "Air Humidity",
      value: 58,
      unit: "%",
      icon: <Activity className="h-5 w-5" />,
      status: "good",
      threshold: { min: 40, max: 70 },
    },
    {
      id: "soil-ph",
      name: "Soil pH",
      value: 6.8,
      unit: "pH",
      icon: <FlaskConical className="h-5 w-5" />,
      status: "good",
      threshold: { min: 6, max: 7.5 },
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => {
          const variance = sensor.id === "soil-ph" ? 0.2 : 5;
          const newValue = sensor.value + (Math.random() - 0.5) * variance;
          const clampedValue =
            sensor.id === "soil-ph"
              ? Math.max(5, Math.min(8, newValue))
              : Math.max(0, Math.min(100, newValue));

          let status: "good" | "warning" | "critical" = "good";
          if (
            clampedValue < sensor.threshold.min ||
            clampedValue > sensor.threshold.max
          ) {
            status = "critical";
          } else if (
            clampedValue < sensor.threshold.min + 5 ||
            clampedValue > sensor.threshold.max - 5
          ) {
            status = "warning";
          }

          return {
            ...sensor,
            value: Math.round(clampedValue * 10) / 10,
            status,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-primary";
      case "warning":
        return "text-accent";
      case "critical":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "good":
        return "bg-primary/10 border-primary/30";
      case "warning":
        return "bg-accent/10 border-accent/30";
      case "critical":
        return "bg-destructive/10 border-destructive/30";
      default:
        return "bg-muted border-border";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-foreground">IoT Sensor Network</CardTitle>
        <p className="text-sm text-muted-foreground">Live field monitoring</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className={`p-4 rounded-lg border-2 transition-all ${getStatusBg(
                sensor.status
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={getStatusColor(sensor.status)}>
                    {sensor.icon}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{sensor.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Range: {sensor.threshold.min}-{sensor.threshold.max} {sensor.unit}
                    </div>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${getStatusColor(sensor.status)}`}>
                  {sensor.value}
                  <span className="text-sm ml-1">{sensor.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
