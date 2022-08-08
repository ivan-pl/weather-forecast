import unknownWeatherImg from "./unknown_weather.png";

const DEFAULT_CITY = "Moscow";
const API_WEATHER = "c2e143f433c82cecf1f594126af9bfd5";

async function getCityName(response) {
  if (response.status !== 200) {
    return DEFAULT_CITY;
  }

  const responseObj = await response.json();
  return responseObj.geoplugin_city || DEFAULT_CITY;
}

export async function getCurrentCity() {
  const city = await fetch("http://www.geoplugin.net/json.gp").then(
    getCityName,
    () => DEFAULT_CITY
  );
  return city;
}

export async function getWeatherInfo(city) {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?" +
    `appid=${API_WEATHER}&q=${city}&units=metric`;

  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error(`Status code = ${response.status}`);
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function loadStarterPage() {
  const cityName = await getCurrentCity();
  document.querySelector(".forecast__city").innerText = cityName;

  const weatherInfo = await getWeatherInfo(cityName);
  if (weatherInfo) {
    document.querySelector(".forecast__temperature").innerText =
      weatherInfo.main.temp;
    document.querySelector(".forecast__image").src =
      "http://openweathermap.org/img/wn/" +
      `${weatherInfo.weather[0].icon}.png`;
  } else {
    document.querySelector(".forecast__temperature").innerText = "?";
    document.querySelector(".forecast__image").src = unknownWeatherImg;
  }
}
