const DEFAULT_CITY = "Moscow";
const API_WEATHER = "c2e143f433c82cecf1f594126af9bfd5";

async function getCityName(response) {
  if (response.status !== 200) {
    return DEFAULT_CITY;
  }

  const responseObj = await response.json();
  return responseObj.geoplugin_city || DEFAULT_CITY;
}

export async function getCurrentCity() {
  const city = await fetch("http://www.geoplugin.net/json.gp").then(
    getCityName,
    () => DEFAULT_CITY
  );
  return city;
}

export async function getWeatherInfo(cityName) {
  const url =
    "https://api.openweathermap.org/data/2.5/weather?" +
    `appid=${API_WEATHER}&q=${cityName}&units=metric`;

  try {
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error(`Status code = ${response.status}`);
    }
    return await response.json();
  } catch {
    return null;
  }
}

export async function getSrcMap({
  lat,
  lon,
  size: { height = 450, width = 450 },
  z = 12,
}) {
  const url =
    "https://static-maps.yandex.ru/1.x/?" +
    `ll=${lon},${lat}&z=${z}&size=${width},${height}&l=map`;

  return fetch(url).then(
    (response) => {
      if (response.status === 200) {
        return url;
      }
      return null;
    },
    () => null
  );
}
