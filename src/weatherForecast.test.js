import { getCurrentCity, getWeatherInfo } from "./weatherForecast";

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
