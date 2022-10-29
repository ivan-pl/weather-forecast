import { displayHistoryList, clickHistoryButton } from "./pageHandler";
import { getWeatherInfo } from "./services";
import { getHistoryList } from "./localStorageController";
import App from "./App";

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
    getSrcMap: jest.fn().mockResolvedValue("https://static-maps.yandex.ru"),
    getWeatherInfo: jest.fn().mockResolvedValue(WEATHER),
  };
});

App.prototype.onMount = jest.fn();

describe("displayHistoryList", () => {
  it("adds 1 element", () => {
    const cityList = ["Moscow"];
    const ol = document.createElement("li");
    displayHistoryList(ol, cityList);

    expect(ol.childNodes).toHaveLength(1);
    ol.childNodes.forEach((elem, ind) =>
      expect(elem.innerText).toBe(cityList[ind])
    );
  });

  it("adds 3 elements", () => {
    const cityList = ["Moscow", "Minks", "Berlin"];
    const ol = document.createElement("ol");
    displayHistoryList(ol, cityList);

    expect(ol.childNodes).toHaveLength(3);
    ol.childNodes.forEach((elem, ind) =>
      expect(elem.innerText).toBe(cityList[ind])
    );
  });
});

describe("clickHistoryButton", () => {
  beforeEach(() => {
    new App(document.body);
    clickHistoryButton();
  });

  it("changes the weather", () => {
    expect(document.querySelector(".forecast__temperature").innerText).toBe(
      WEATHER.main.temp
    );
  });

  it("changes the city", () => {
    expect(document.querySelector(".forecast__city").innerText).toBe(
      WEATHER.name
    );
  });

  it("gets the city from the input value", () => {
    const cityName = "Berlin";
    document.querySelector(".history__input-city").value = cityName;
    clickHistoryButton();
    expect(getWeatherInfo).toHaveBeenCalledWith(cityName);
  });

  it("adds the city in localStorage", () => {
    expect(getHistoryList()).toContain(WEATHER.name);
  });

  it("creates element containing the city", () => {
    expect(document.querySelector(".history__city").innerText).toBe(
      WEATHER.name
    );
  });
});
