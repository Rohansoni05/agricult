import React, { useState } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets, Thermometer, MapPin } from "lucide-react";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getWeatherIcon = (condition, isDay) => {
    const iconClass = "w-16 h-16 text-white drop-shadow-lg";
    const text = condition.toLowerCase();
    
    if (text.includes('rain') || text.includes('drizzle')) {
      return <CloudRain className={iconClass} />;
    } else if (text.includes('snow')) {
      return <CloudSnow className={iconClass} />;
    } else if (text.includes('cloud')) {
      return <Cloud className={iconClass} />;
    } else if (text.includes('clear') || text.includes('sunny')) {
      return <Sun className={iconClass} />;
    }
    return isDay ? <Sun className={iconClass} /> : <Cloud className={iconClass} />;
  };

  const getWeather = async () => {
    setLoading(true);
    setWeather(null);
    setError("");

    if (!city.trim()) {
      setError("⚠️ Please enter a city name.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=fd54a18f509a4101b74191515250509&q=${city}&aqi=no`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 transform transition-all duration-300 hover:scale-105">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
              🌤️ Weather Checker
            </h1>
            <p className="text-white/80 text-sm">Get real-time weather information</p>
          </div>

          {/* Search Section */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter city name..."
                className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              />
            </div>
            
            <button
              onClick={getWeather}
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Getting Weather...</span>
                </div>
              ) : (
                "Get Weather"
              )}
            </button>
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="animate-fade-in">
              {/* Location Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <MapPin className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">
                    {weather.location.name}, {weather.location.country}
                  </h2>
                </div>
                <p className="text-white/80 text-sm">{weather.location.localtime}</p>
              </div>

              {/* Main Weather Info */}
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weather.current.condition.text, weather.current.is_day)}
                </div>
                <div className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
                  {Math.round(weather.current.temp_c)}°C
                </div>
                <div className="text-lg text-white/90 font-medium">
                  {weather.current.condition.text}
                </div>
                <div className="text-white/80 text-sm mt-1">
                  Feels like {Math.round(weather.current.feelslike_c)}°C
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm">Wind</span>
                  </div>
                  <div className="text-white font-semibold">{weather.current.wind_kph} km/h</div>
                  <div className="text-white/70 text-xs">{weather.current.wind_dir}</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm">Humidity</span>
                  </div>
                  <div className="text-white font-semibold">{weather.current.humidity}%</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm">Visibility</span>
                  </div>
                  <div className="text-white font-semibold">{weather.current.vis_km} km</div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="w-4 h-4 text-white/80" />
                    <span className="text-white/80 text-sm">Pressure</span>
                  </div>
                  <div className="text-white font-semibold">{weather.current.pressure_mb} mb</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl">
              <p className="text-white text-center font-medium animate-shake">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Powered by WeatherAPI • Real-time data
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default WeatherApp;