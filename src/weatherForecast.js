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

export async function clickWeatherButton(event) {
  let cityName = "";
  if (event.target === document.querySelector(".history__button")) {
    cityName = document.querySelector(".history__input-city").value;
  } else {
    cityName = event.target.innerText;
  }

  const weatherInfo = await getWeatherInfo(cityName);
  if (weatherInfo === null) {
    alert(`Failed to get weather for ${cityName}`);
    return;
  }

  document.querySelector(".forecast__city").innerText = cityName;
  document.querySelector(".forecast__temperature").innerText =
    weatherInfo.main.temp;
  document.querySelector(
    ".forecast__image"
  ).src = `http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`;

  addCityToHistory(cityName);
}

function addCityToHistory(cityName) {
  const cityElem = document.createElement("li");
  cityElem.innerText = cityName;
  cityElem.classList.add("history__city");
  cityElem.addEventListener("click", clickWeatherButton);
  document.querySelector(".history__list").prepend(cityElem);

  let historyList = JSON.parse(localStorage.getItem("historyList"));
  if (historyList === null) {
    historyList = [];
  }
  historyList.unshift(cityName);
  if (historyList.length > 10) {
    historyList.pop();
    document.querySelector(".history__city:last-child").remove();
  }
  localStorage.setItem("historyList", JSON.stringify(historyList));
}

function loadHistoryList() {
  if (localStorage.getItem("historyList") === null) {
    return;
  }

  const historyList = JSON.parse(localStorage.getItem("historyList"));
  const historyContainerElement = document.querySelector(".history__list");
  historyList.forEach((element) => {
    const cityElem = document.createElement("li");
    cityElem.innerText = element;
    cityElem.classList.add("history__city");
    cityElem.addEventListener("click", clickWeatherButton);
    historyContainerElement.append(cityElem);
  });
}

export async function loadStarterPage() {
  const cityName = await getCurrentCity();
  document.querySelector(".forecast__city").innerText = cityName;
  loadHistoryList();
  addCityToHistory(cityName);

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

  const button = document.querySelector(".history__button");
  button.addEventListener("click", clickWeatherButton);

  document
    .querySelector(".history__input-city")
    .addEventListener("keyup", (e) => {
      if (e.target.value === "") {
        document.querySelector(".history__button").disabled = true;
      } else {
        document.querySelector(".history__button").disabled = false;
        if (e.key === "Enter") {
          button.click();
        }
      }
    });
}
