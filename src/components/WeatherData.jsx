import React from "react";
import { useState, useEffect } from "react";
import './WeatherData.css'
import { v4 as uuid } from "uuid";
import { FaSpinner } from "react-icons/fa";
import { Thermometer, Wind } from "phosphor-react";
import ErrorPage from "./ErrorPage";

const WeatherData = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [searchedCity, setSearchedCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emptyInput, setEmptyInput] = useState("");
  

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

  const upperCaseInitials = (words) => {
    return words
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.substring(1);
      })
      .join(" ");
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
       return <ErrorPage />
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
        <span className="empty-input">
          <h3>{emptyInput}</h3>
        </span>
      </form>
      {city && weather && (
        <div className="weather-data">
          <h1>{upperCaseInitials(city)}</h1>
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
                        ).replace('-feira', '')}
                  </h3>
                  <div className="row">
                    <Thermometer />
                    <strong>{dayForecast.temperature.replace("+", "")}</strong>
                  </div>
                  <div className="row">
                    <Wind />
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
