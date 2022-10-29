import { Component } from "./Component";
import {
  displayHistoryList,
  updateData,
  clickHistoryButton,
} from "./pageHandler";
import { getCurrentCity } from "./services";
import { getHistoryList } from "./localStorageController";

class App extends Component {
  constructor(...args) {
    super(...args);
    this.events = {
      "click@.history__button": clickHistoryButton,
      "keyup@.history__input-city": (e) => {
        const button = document.querySelector(".history__button");

        if (e.target.value === "") {
          button.disabled = true;
        } else {
          button.disabled = false;
          if (e.key === "Enter") {
            button.click();
          }
        }
      },
    };
  }

  onMount() {
    const historyListElem = document.querySelector(".history__list");
    displayHistoryList(historyListElem, getHistoryList());
    getCurrentCity().then((cityName) => {
      updateData(cityName);
    });
  }

  render() {
    return `<main class="main">
      <article class="forecast">
        <figure class="forecast__weather-info">
          <img
            class="forecast__image"
            src="./images/unknown_weather.png"
            alt="weather image"
          />
          <figcaption class="forecast__weather-text">
            <h2 class="forecast__city">?</h2>
            <p class="forecast__temperature">?</p>
          </figcaption>
        </figure>
      </article>
      <article class="history">
        <div class="history__wrap">
          <input
            type="text"
            placeholder="Enter city"
            class="history__input-city"
          />
          <button
            class="history__button fa-solid fa-magnifying-glass"
            disabled
          ></button>
        </div>
        <ol class="history__list"></ol>
      </article>
      <div class="map-wrap">
        <img
          class="map"
          src="./images/unknown_location.png"
          alt="The city map"
        />
      </div>
    </main>`;
  }
}

export default App;
