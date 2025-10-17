import { useState } from "react";
import bgImage from "../images/weather.jpg";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
}

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError("City not found. Try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      className=" w-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* content */}
      <div className="relative z-5 text-center px-4 flex flex-col items-center h-full">
        <h1 className="text-4xl mt-8 mb-8 font-bold text-white drop-shadow-lg">
          Weather Forecast
        </h1>
        <p className="text-lg mb-5 text-gray-200">Get instant weather updates 🌤️</p>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 text-white bg-transparent border-2 border-white "
          />
          <button
            type="submit"
            className="bg-blue-600 border-2 border-black px-4 py-2 font-medium text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            Search
          </button>
        </form>

        {error && <p className="mt-4 text-red-300">{error}</p>}

        {weather && (
          <div className="mt-6 px-12 py-3  bg-white/20 rounded-xl backdrop-blur-md text-white shadow-lg text-center">
            <h2 className=" font-semibold">{weather.name}</h2>
            <p className="capitalize text-lg">
              {weather.weather[0].description}
            </p>
            <p className="text-4xl font-bold mt-2">{weather.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto "
            />
            <p className=" text-sm text-gray-200">
              Humidity: {weather.main.humidity}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
