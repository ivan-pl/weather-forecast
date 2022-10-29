import { loadStarterPage } from "./init";
import { addCityToStorage } from "./localStorageController";
import App  from "./App";

const WEATHER = {
  coord: {
    lon: 37.6156,
    lat: 55.7522,
  },
  name: "Moscow",
  main: {
    temp: 29.51,
  },
  weather: [
    {
      icon: "01d",
    },
  ],
};

jest.mock("./services", () => {
  const originalModule = jest.requireActual("./services");

  return {
    __esModule: true,
    ...originalModule,
    getCurrentCity: jest.fn().mockResolvedValue(WEATHER.name),
    getSrcMap: jest.fn().mockResolvedValue("https://static-maps.yandex.ru"),
    getWeatherInfo: jest.fn().mockResolvedValue(WEATHER),
  };
});

describe("loadStarterPage", () => {
  const citiesCount = 5;
  beforeAll(() => {
    for (let i = 0; i < citiesCount; i++) {
      addCityToStorage(`Moscow ${i}`);
    }
    new App(document.body);
    loadStarterPage();
  });

  it("checks layout", () => {
    expect(document.querySelector(".forecast__city")).not.toBeNull();
    expect(document.querySelector(".forecast__temperature")).not.toBeNull();
    expect(document.querySelector(".forecast__image")).not.toBeNull();
  });

  it("history contains 5 cities", () => {
    expect(document.querySelectorAll(".history__city")).toHaveLength(
      citiesCount + 1
    );
  });

  it("checks current forecast information", () => {
    expect(document.querySelector(".forecast__city").innerText).toBe(
      WEATHER.name
    );
    expect(document.querySelector(".forecast__temperature").innerText).toBe(
      WEATHER.main.temp
    );
    expect(document.querySelector(".forecast__image").src).toMatch(
      new RegExp(`${WEATHER.weather[0].icon}.+?png`)
    );
    expect(document.querySelector(".map").src).toMatch(
      "https://static-maps.yandex.ru"
    );
  });
});
