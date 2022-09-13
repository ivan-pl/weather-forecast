const STORAGE_KEY = "list of cities";

export function getHistoryList() {
  let historyList = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (historyList === null) {
    historyList = [];
  }

  return historyList;
}

export function addCityToStorage(cityName) {
  const historyList = getHistoryList();
  const cityInd = historyList.indexOf(cityName);
  if (cityInd !== -1) {
    historyList.splice(cityInd, 1);
  }

  historyList.unshift(cityName);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyList.slice(0, 10)));
}
