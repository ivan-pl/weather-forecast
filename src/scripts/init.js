import {
  displayHistoryList,
  updateData,
  clickHistoryButton,
} from "./pageHandler";
import { getCurrentCity } from "./services";
import { getHistoryList } from "./localStorageController";

export async function loadStarterPage() {
  const cityName = await getCurrentCity();
  const historyListElem = document.querySelector(".history__list");

  document.querySelector(".forecast__city").innerText = cityName;
  displayHistoryList(historyListElem, getHistoryList());
  updateData(cityName);

  const button = document.querySelector(".history__button");
  button.addEventListener("click", clickHistoryButton);
  document
    .querySelector(".history__input-city")
    .addEventListener("keyup", (e) => {
      if (e.target.value === "") {
        button.disabled = true;
      } else {
        button.disabled = false;
        if (e.key === "Enter") {
          button.click();
        }
      }
    });
}
