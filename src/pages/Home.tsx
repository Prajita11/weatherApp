import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import bgImage from "../images/weather.jpg";

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: { description: string; icon: string }[];
}

const defaultCities = ["San Francisco", "Oakland", "Richmond"];

function Home() {
  const [city, setCity] = useState("");
  const [searchedWeathers, setSearchedWeathers] = useState<WeatherData[]>([]);
  const [defaultWeathers, setDefaultWeathers] = useState<WeatherData[]>([]);
  const [error, setError] = useState("");
  const [units, setUnits] = useState<string>(() => localStorage.getItem("units") || "metric");

  const { t, i18n } = useTranslation();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    async function fetchDefaultCities() {
      const data = await Promise.all(
        defaultCities.map(async (city) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
          );
          return res.json();
        })
      );
      setDefaultWeathers(data.filter((d) => d.cod === 200));
    }
    fetchDefaultCities();
  }, [API_KEY, units]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError(t("city_not_found"));
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=${i18n.language}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setSearchedWeathers((prev) => [data, ...prev.filter((item) => item.name !== data.name)].slice(0, 3));
        setError("");
      } else {
        setError(t("city_not_found"));
      }
    } catch {
      setError(t("city_not_found"));
    }
  };

  // fetch forecast for a city name
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleUnitChange = (newUnit: string) => {
    setUnits(newUnit);
    localStorage.setItem("units", newUnit);
  };

  const translateCity = (cityName: string) => t(`cities.${cityName}`, cityName);
  const translateWeather = (desc: string) => t(`weather_desc.${desc}`, desc);

  return (
    <div
      className="w-screen bg-cover bg-center relative min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Language Switcher */}
      <div className="absolute top-1 right-4 z-10">
        <select
          onChange={handleLanguageChange}
          value={i18n.language}
          className="px-3 py-1 rounded border border-gray-300 bg-white/80 text-sm sm:text-base"
        >
          <option value="en">English</option>
          <option value="ne">नेपाली</option>
          <option value="es">Español</option>
        </select>
      </div>
      {/* Units Toggle(C & F) */}
      <div className="absolute top-1 right-28 z-10 flex gap-2">
        <button
          onClick={() => handleUnitChange("metric")}
          className={`px-2 py-1 rounded ${units === "metric" ? "bg-white/90 text-black" : "bg-white/30 text-white"}`}
        >
          °C
        </button>
        <button
          onClick={() => handleUnitChange("imperial")}
          className={`px-2 py-1 rounded ${units === "imperial" ? "bg-white/90 text-black" : "bg-white/30 text-white"}`}
        >
          °F
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-5 text-center px-4 flex flex-col items-center justify-start min-h-screen pt-4 sm:pt-6">

        <h1 className="text-3xl sm:text-4xl mt-1 mb-2 font-bold text-white drop-shadow-lg text-center">
          {t("title")}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6">
          {t("subtitle")}
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder={t("placeholder")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-2 text-white bg-transparent border-2 border-white rounded-md text-sm sm:text-base focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 border-2 border-black px-4 py-2 font-medium text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-sm sm:text-base"
          >
            {t("search")}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-300 text-sm sm:text-base">{error}</p>
        )}

        {/* Default Cities */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 px-2">
          {defaultWeathers.map((w, index) => (
            <div
                  key={index}
                  className="px-8 sm:px-10 py-4 bg-white/20 rounded-xl backdrop-blur-md text-white shadow-lg text-center w-60 sm:w-64"
                  style={{ minHeight: "14rem", transition: "opacity 200ms ease" }}
            >
              <h2 className="font-semibold text-lg sm:text-xl">
                {translateCity(w.name)}
              </h2>
              <p className="capitalize text-sm sm:text-lg">
                {translateWeather(w.weather[0].description)}
              </p>
              <p className="text-3xl sm:text-4xl font-bold mt-2">
                {t("degree", {
                  value: w.main.temp,
                  unit: units === "metric" ? "C" : "F",
                })}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                alt={w.weather[0].description}
                className="mx-auto w-16 sm:w-20"
              />
              <p className="text-xs sm:text-sm text-gray-200">
                {t("humidity", { value: w.main.humidity })}
              </p>
            </div>
          ))}
        </div>

        {/* Searched Cities */}
        {searchedWeathers.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-6 px-2">
            {searchedWeathers.map((w, index) => (
              <div
                key={`${w.name}-${index}`}
                  className="px-8 sm:px-10 py-4 bg-white/20 rounded-xl backdrop-blur-md text-white shadow-lg text-center w-60 sm:w-64"
                  style={{ minHeight: "14rem", transition: "opacity 200ms ease" }}
              >
                <h2 className="font-semibold text-lg sm:text-xl">
                  {translateCity(w.name)}
                </h2>
                <p className="capitalize text-sm sm:text-lg">
                  {translateWeather(w.weather[0].description)}
                </p>
                <p className="text-3xl sm:text-4xl font-bold mt-2">
                  {t("degree", {
                    value: w.main.temp,
                    unit: units === "metric" ? "C" : "F",
                  })}
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                  alt={w.weather[0].description}
                  className="mx-auto w-16 sm:w-20"
                />
                <p className="text-xs sm:text-sm text-gray-200">
                  {t("humidity", { value: w.main.humidity })}
                </p>
              </div>
            ))}
          </div>
        )}
        
       
      </div>
    </div>
  );
}

export default Home;
