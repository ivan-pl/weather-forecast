const DEFAULT_CITY = "Moscow";

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
