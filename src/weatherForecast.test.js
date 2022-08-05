import { getCurrentCity } from "./weatherForecast";

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
