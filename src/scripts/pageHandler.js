import { getSrcMap, getWeatherInfo } from "./services";
import { addCityToStorage } from "./localStorageController";
import unknownLocationImg from "../images/unknown_location.png";

export function displayHistoryList(parentElem, stringArray) {
  for (let i = stringArray.length - 1; i >= 0; i--) {
    addCityToHistoryList(stringArray[i], parentElem);
  }
}

async function updateMap(lat, lon) {
  const map = document.querySelector(".map");
  const src = await getSrcMap({
    lat,
    lon,
    size: { width: map.width, height: map.height },
  });
  document.querySelector(".map").src = src ?? unknownLocationImg;
}

function clickCityName(event) {
  updateData(event.target.innerText);
}

function deleteCityFromHistory(cityName) {
  const list = document.querySelectorAll(".history__city");
  for (let i = 0; i < list.length; i++) {
    if (list[i].innerText === cityName) {
      list[i].remove();
      break;
    }
  }
}

function isElemContainsString(elem, string) {
  return [].some.call(elem.childNodes, (item) =>
    item.innerText.includes(string)
  );
}

function addCityToHistoryList(cityName, parentElem) {
  const cityElem = document.createElement("li");
  cityElem.innerText = cityName;
  cityElem.classList.add("history__city");
  cityElem.addEventListener("click", clickCityName);

  if (isElemContainsString(parentElem, cityName)) {
    deleteCityFromHistory(cityName);
  }

  parentElem.prepend(cityElem);
  addCityToStorage(cityName);
}

export async function updateData(inputCity) {
  const weatherInfo = await getWeatherInfo(inputCity);
  if (weatherInfo === null) {
    alert(`Failed to get weather for ${inputCity}`);
    return;
  }

  const {
    coord: { lon, lat },
    weather: [{ icon }],
    main: { temp: temperature },
    name: cityName,
  } = weatherInfo;

  document.querySelector(".forecast__city").innerText = cityName;
  document.querySelector(".forecast__temperature").innerText = temperature;
  document.querySelector(
    ".forecast__image"
  ).src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  addCityToHistoryList(cityName, document.querySelector(".history__list"));
  updateMap(lat, lon);
}

export function clickHistoryButton() {
  const inputCity = document.querySelector(".history__input-city").value;
  updateData(inputCity);
}
