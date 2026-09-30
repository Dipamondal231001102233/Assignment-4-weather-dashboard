import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = async (searchCity) => {
    if (!searchCity.trim()) {
      setError("Please enter a city name.");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        searchCity
      )}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to get weather data.");
      }

      setWeather(data);
    } catch (error) {
      setError(error.message || "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Kolkata weather when the page opens
  useEffect(() => {
    getWeather("Kolkata");
  }, []);

  const handleSearch = () => {
    getWeather(city);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app">
      <h1>Weather Dashboard</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <div className="loading">Loading weather...</div>}

      {error && <div className="error">{error}</div>}

      {weather && !loading && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
            className="weather-icon"
          />

          <h3>{Math.round(weather.main.temp)}°C</h3>

          <p className="description">
            {weather.weather[0].description}
          </p>

          <div className="weather-details">
            <div className="detail-box">
              <strong>💧 Humidity</strong>
              <p>{weather.main.humidity}%</p>
            </div>

            <div className="detail-box">
              <strong>💨 Wind Speed</strong>
              <p>{weather.wind.speed} m/s</p>
            </div>

            <div className="detail-box">
              <strong>🌅 Sunrise</strong>
              <p>{formatTime(weather.sys.sunrise)}</p>
            </div>

            <div className="detail-box">
              <strong>🌇 Sunset</strong>
              <p>{formatTime(weather.sys.sunset)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;