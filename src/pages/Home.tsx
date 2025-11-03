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

function Home() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [defaultWeathers, setDefaultWeathers] = useState<WeatherData[]>([]);
  const [error, setError] = useState("");

  const { t, i18n } = useTranslation();
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const defaultCities = ["Kathmandu", "Lalitpur", "Bhaktapur"];

  useEffect(() => {
    async function fetchDefaultCities() {
      const data = await Promise.all(
        defaultCities.map(async (city) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${i18n.language}`
          );
          return res.json();
        })
      );
      setDefaultWeathers(data.filter((d) => d.cod === 200));
    }
    fetchDefaultCities();
  }, [API_KEY, i18n.language]);

  // Handle search city
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) {
      setError(t("city_not_found"));
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=${i18n.language}`
      );
      const data = await res.json();
      if (data.cod === 200) {
        setWeather(data);
        setError("");
      } else {
        setError(t("city_not_found"));
        setWeather(null);
      }
    } catch {
      setError(t("city_not_found"));
    }
  };

  // Handle language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Translate city and weather safely
  const translateCity = (cityName: string) => {
    return t(`cities.${cityName}`, cityName);
  };

  const translateWeather = (desc: string) => {
    return t(`weather_desc.${desc}`, desc);
  };

  return (
    <div
      className="w-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        height: "100vh",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <select
          onChange={handleLanguageChange}
          value={i18n.language}
          className="px-2 py-1 rounded border border-gray-300 bg-white/80"
        >
          <option value="en">English</option>
          <option value="ne">नेपाली</option>
        </select>
      </div>

      {/* content */}
      <div className="relative z-5 text-center px-4 flex flex-col items-center h-full">
        <h1 className="text-4xl mt-2 mb-2 font-bold text-white drop-shadow-lg">
          {t("title")}
        </h1>
        <p className="text-lg mt-2 mb-5 text-gray-200">{t("subtitle")}</p>

        {/* search bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder={t("placeholder")}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 text-white bg-transparent border-2 border-white"
          />
          <button
            type="submit"
            className="bg-blue-600 border-2 border-black px-4 py-2 font-medium text-white rounded hover:bg-blue-700 transition-colors duration-300"
          >
            {t("search")}
          </button>
        </form>

        {error && <p className="mt-4 text-red-300">{error}</p>}

        {/* Default Cities */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {defaultWeathers.map((w, index) => (
            <div
              key={index}
              className="px-12 py-3 bg-white/20 rounded-xl backdrop-blur-md text-white shadow-lg text-center"
            >
              <h2 className="font-semibold">{translateCity(w.name)}</h2>
              <p className="capitalize text-lg">
                {translateWeather(w.weather[0].description)}
              </p>
              <p className="text-4xl font-bold mt-2">
                {t("degree", { value: w.main.temp })}
              </p>
              <img
                src={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
                alt={w.weather[0].description}
                className="mx-auto"
              />
              <p className="text-sm text-gray-200">
                {t("humidity", { value: w.main.humidity })}
              </p>
            </div>
          ))}
        </div>

        {/* Searched city */}
        {weather && (
          <div className="mt-6 px-12 py-3 bg-white/20 rounded-xl backdrop-blur-md text-white shadow-lg text-center">
            <h2 className="font-semibold">{translateCity(weather.name)}</h2>
            <p className="capitalize text-lg">
              {translateWeather(weather.weather[0].description)}
            </p>
            <p className="text-4xl font-bold mt-2">
              {t("degree", { value: weather.main.temp })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="mx-auto"
            />
            <p className="text-sm text-gray-200">
              {t("humidity", { value: weather.main.humidity })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
