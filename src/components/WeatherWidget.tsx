import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
}

const locations = [
  { name: "Hamirpur", lat: 25.95, lon: 80.15 },
  { name: "Kanpur", lat: 26.45, lon: 80.35 },
  { name: "Gorakhpur", lat: 26.75, lon: 83.37 },
  { name: "Greater Noida", lat: 28.47, lon: 77.50 },
  { name: "Lucknow", lat: 26.85, lon: 80.95 },
  { name: "Jhansi", lat: 25.45, lon: 78.57 },
];

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Using Open-Meteo API - free, no API key required
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia/Kolkata`
        );
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: data.current.relative_humidity_2m,
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
        });
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [selectedLocation]);

  const getWeatherDescription = (code: number) => {
    if (code === 0) return "Clear sky";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Foggy";
    if (code <= 67) return "Rainy";
    if (code <= 77) return "Snowy";
    if (code <= 82) return "Rain showers";
    return "Thunderstorm";
  };

  return (
    <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Cloud className="h-5 w-5 text-secondary" />
          Live Weather
        </CardTitle>
        <Select
          value={selectedLocation.name}
          onValueChange={(value) => {
            const location = locations.find(loc => loc.name === value);
            if (location) setSelectedLocation(location);
          }}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.name} value={loc.name}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-muted-foreground">Loading weather data...</div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              {getWeatherDescription(weather.weatherCode)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-accent" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{weather.temperature}°C</div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-secondary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{weather.humidity}%</div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-primary" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{weather.windSpeed} km/h</div>
                  <div className="text-xs text-muted-foreground">Wind Speed</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground">No weather data available</div>
        )}
      </CardContent>
    </Card>
  );
};
