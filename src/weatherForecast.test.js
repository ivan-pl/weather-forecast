import fs from "fs";
import path from "path";
import {
  getCurrentCity,
  getWeatherInfo,
  loadStarterPage,
  clickWeatherButton,
} from "./weatherForecast";

const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");

describe("getCurrentCity", () => {
  beforeEach(() => {
    fetch.doMock();
  });

  it("returns Moscow", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ geoplugin_city: "Moscow" }),
      status: 200,
    });
    await expect(getCurrentCity()).resolves.toBe("Moscow");
  });

  it("returns Nuremberg", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ geoplugin_city: "Nuremberg" }),
      status: 200,
    });
    await expect(getCurrentCity()).resolves.toBe("Nuremberg");
  });

  it("returns Moscow for all exceptions", async () => {
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ geoplugin_city: "Nuremberg" }),
      status: 400,
    });
    await expect(getCurrentCity()).resolves.toBe("Moscow");

    fetch.mockResolvedValue({
      json: () => Promise.resolve({ geoplugin_city: "" }),
      status: 200,
    });
    await expect(getCurrentCity()).resolves.toBe("Moscow");

    fetch.mockRejectedValue(new Error("Unknown error"));
    await expect(getCurrentCity()).resolves.toBe("Moscow");
  });

  afterEach(() => {
    fetch.dontMock();
  });
});

describe("getWeatherInfo", () => {
  beforeEach(() => {
    fetch.doMock();
  });

  it("API works", async () => {
    fetch.resetMocks();
    fetch.dontMock();

    const weather = await getWeatherInfo("Moscow");
    const urlFetch = fetch.mock.calls[0][0];
    const returnFetchObj = fetch.mock.results[0].value;
    expect(returnFetchObj).toBeInstanceOf(Promise);

    const returnFetchValue = await returnFetchObj;

    expect(returnFetchValue.status).toBe(200);
    expect(urlFetch).toContain("api.openweathermap.org");
    expect(Object.keys(weather)).toEqual(
      expect.arrayContaining(["main", "weather"])
    );
  });

  it("returns 29.51", async () => {
    const weather = {
      main: {
        temp: 29.51,
      },
      weather: [
        {
          icon: "01d",
        },
      ],
    };

    fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(weather),
    });

    await expect(getWeatherInfo("Moscow")).resolves.toEqual(weather);
  });

  it("returns null for all errors", async () => {
    fetch.mockRejectOnce(new Error("Unknown error"));
    await expect(getWeatherInfo("Moscow")).resolves.toBe(null);

    fetch.mockResolvedValue({
      status: 400,
    });
    await expect(getWeatherInfo("Moscow")).resolves.toBe(null);
  });

  afterEach(() => {
    fetch.dontMock();
  });
});

describe("loadStarterPage", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
  });

  it("checks layout", () => {
    expect(document.querySelector(".forecast__city")).not.toBeNull();
    expect(document.querySelector(".forecast__temperature")).not.toBeNull();
    expect(document.querySelector(".forecast__image")).not.toBeNull();
  });

  it("shows city and temperature", async () => {
    fetch.resetMocks();
    fetch.dontMock();
    await loadStarterPage();
    expect(document.querySelector(".forecast__city").innerText).toMatch(
      /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
    );
    expect(
      typeof document.querySelector(".forecast__temperature").innerText
    ).toBe("number");
    expect(document.querySelector(".forecast__image").src).toMatch(
      /openweathermap/
    );
  });

  it("shows Moscow and temperature = ?", async () => {
    fetch.doMock();
    fetch.mockReject(new Error("Unknown error"));
    await loadStarterPage();
    expect(document.querySelector(".forecast__city").innerText).toBe("Moscow");
    expect(document.querySelector(".forecast__temperature").innerText).toBe(
      "?"
    );
    fetch.dontMock();
  });
});

describe("clickWeatherButton", () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.dontMock();
    document.documentElement.innerHTML = html.toString();
  });

  async function enterCity(cityName) {
    document.querySelector(".history__input-city").value = cityName;
    await clickWeatherButton({
      target: document.querySelector(".history__button"),
    });
  }

  it("shows weather for Berlin", async () => {
    const cityName = "Berlin";
    await enterCity(cityName);

    expect(document.querySelector(".forecast__city").innerText).toBe(cityName);
    expect(
      typeof document.querySelector(".forecast__temperature").innerText
    ).toBe("number");
  });

  it("shows alert without making changes", async () => {
    function getWeatherInfoFromPage() {
      return {
        cityName: document.querySelector(".forecast__city").innerText,
        temperature: document.querySelector(".forecast__temperature").innerText,
      };
    }

    const alertOriginal = window.alert;
    window.alert = jest.fn();
    const prevData = getWeatherInfoFromPage();

    const cityName = "noSuchCityName";
    await enterCity(cityName);

    const curData = getWeatherInfoFromPage();
    expect(curData).toEqual(prevData);
    expect(alert.mock.calls).toHaveLength(1);
    expect(alert.mock.calls[0][0]).toBe(
      `Failed to get weather for ${cityName}`
    );

    window.alert = alertOriginal;
  });

  it("adds cities into localStorage", async () => {
    const cityNames = ["Moscow", "Berlin", "London"];
    for (const cityName of cityNames) {
      await enterCity(cityName);
    }

    const historyList = Array.from(
      document.querySelectorAll(".history__city")
    ).map((item) => item.innerText);
    expect(historyList.reverse()).toEqual(cityNames);
  });

  it("saves only 10 last cities", async () => {
    const weather = {
      main: {
        temp: 29.51,
      },
      weather: [
        {
          icon: "01d",
        },
      ],
    };

    fetch.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(weather),
    });

    const cityNames = new Array(14).fill("Moscow");
    for (const cityName of cityNames) {
      await enterCity(cityName);
    }
    expect(JSON.parse(localStorage.getItem("historyList"))).toHaveLength(10);
  });
});
