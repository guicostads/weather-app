import React from "react";
import { useState, useEffect } from "react";
import "../App.css";
import WeatherImg from "../imgs/weather-app-icon.png";
import { v4 as uuid } from "uuid";
import {
  FaSpinner,
  FaThermometer as Thermometericon,
  FaWind as WindIcon,
} from "react-icons/fa";

const WeatherData = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [searchedCity, setSearchedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emptyInput, setEmptyInput] = useState("");
  const [error, setError] = useState("");

  const getCity = (e) => {
    setSearchedCity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(searchedCity);
    searchedCity === ""
      ? setEmptyInput("Por favor, digite uma cidade.")
      : setEmptyInput("");
  };

  const translatedWeatherTable = {
    "Partly cloudy": "Parcialmente nublado",
    'Clear': "Céu limpo",
    "Light snow": "Neve leve",
    'Sunny': "Ensolarado",
    "Rain with thunderstorm": "Chuva com tempestade de raios",
    "Light rain with thunderstorm": "Chuva leve com tempestade de raios",
    "Patchy rain possible": "Possível chuva irregular",
  };

  useEffect(() => {
    async function getCityWeather() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://goweather.herokuapp.com/weather/${searchedCity}`
        );
        const data = await response.json();
        setWeather(data);
        console.log(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }

    getCityWeather();
  }, [city]);

  return (
    <div>
      <form action="" onSubmit={handleSubmit}>
        <div className="searchTab">
          <input
            type="text"
            name="searchTab"
            placeholder="Ex: Porto Alegre"
            onChange={getCity}
          ></input>
          <button type="submit">
            {isLoading ? (
              <FaSpinner className="loading" />
            ) : (
              <strong>Pesquisar Cidade</strong>
            )}
          </button>
        </div>
        <div className="no-input">
          <h3>{emptyInput}</h3>
        </div>
      </form>
      {city && weather && (
        <div className="weather-data">
          <h1>
            {city
              .split(" ")
              .map((word) => {
                return word.charAt(0).toUpperCase() + word.substring(1);
              })
              .join(" ")}
          </h1>
          <h2>Tempo atual:</h2>
          <h2>{weather.temperature.replace("+", "")}</h2>
          <p>
            {translatedWeatherTable[weather.description]
              ? translatedWeatherTable[weather.description]
              : weather.description}
          </p>
          <h2>Previsão:</h2>
          <ul>
            {weather.forecast.map((dayForecast, index) => {
              return (
                <li key={uuid()}>
                  <h3>
                    {index == 0
                      ? "Amanhã"
                      : Intl.DateTimeFormat("pt-BR", {
                          weekday: "long",
                        }).format(
                          new Date().setDate(new Date().getDate() + index + 1)
                        )}
                  </h3>
                  <div className="row">
                    <Thermometericon />
                    <strong>{dayForecast.temperature.replace("+", "")}</strong>
                  </div>
                  <div className="row">
                    <WindIcon />
                    <strong>{dayForecast.wind}</strong>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WeatherData;
