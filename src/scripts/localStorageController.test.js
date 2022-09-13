import { addCityToStorage, getHistoryList } from "./localStorageController";

describe("addCityToStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterAll(() => {
    localStorage.clear();
  });

  it("adds Moscow to storage", () => {
    const cityName = "Moscow";
    addCityToStorage(cityName);
    expect(getHistoryList()).toContain(cityName);
  });

  it("adds Moscow only once", () => {
    const cityName = "Moscow";
    for (let i = 0; i < 5; i++) {
      addCityToStorage(cityName);
    }

    const cityCounter = (prev, cur) => (cur === cityName ? prev + 1 : prev);
    expect(getHistoryList().reduce(cityCounter, 0)).toBe(1);
  });

  it("adds 3 different cities", () => {
    const cityName = "Moscow";
    for (let i = 0; i < 3; i++) {
      addCityToStorage(cityName + i);
    }

    expect(getHistoryList()).toHaveLength(3);
  });

  it("adds not greater than 10 cities", () => {
    const cityName = "Moscow";
    for (let i = 0; i < 15; i++) {
      addCityToStorage(cityName + i);
    }

    expect(getHistoryList()).toHaveLength(10);
  });
});
