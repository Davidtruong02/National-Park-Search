const apiKey = "151fee77ec9df13d3f8e8d88f6890fc2";
const mapQuestApiKey = "ej1jF6SPfaZl671vKt3mUoMxw2Cdj7iV";
const searchForm = document.getElementById("input-container");
const forecastInfo = document.getElementById("forecast-container");
const units = "imperial";

async function searchNationalParkWeather(event) {
  event.preventDefault();
  console.log("HELLO THERE, THIS IS SEARCH NATIONAL PARK WEATHER");

  const parkInput = document.getElementById("parkInput");
  const parkName = parkInput.value.trim();

  if (parkName === "") {
    alert("Please enter a National Park name.");
    return;
  }

  try {
    const location = await getCoordinates(parkName);
    const [lat, lon] = location.split(",");
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastApiUrl);
    const forecastData = await forecastResponse.json();

    forecastInfo.innerHTML = '<h2>5-Day Weather Forecast</h2>';

    for (let i = 0; i < forecastData.list.length; i += 8) {
      const forecast = forecastData.list[i];
      const date = new Date(forecast.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });

      forecastInfo.innerHTML += `
        <div class="forecast-day">
          <p>${day}</p>
          <p> <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}" /> </p>
          <p>Temperature: ${forecast.main.temp} °F</p>
          <p>Humidity: ${forecast.main.humidity}%</p>
          <p>Wind Speed: ${forecast.wind.speed} m/s</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

async function getCoordinates(parkName) {
  const geocodingApiUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestApiKey}&location=${parkName}`;
  const response = await fetch(geocodingApiUrl);
  const data = await response.json();

  if (
    data.results &&
    data.results[0] &&
    data.results[0].locations &&
    data.results[0].locations[0]
  ) {
    return `${data.results[0].locations[0].latLng.lat},${data.results[0].locations[0].latLng.lng}`;
  } else {
    throw new Error(
      "Unable to fetch coordinates for the specified National Park."
    );
  }
}

searchForm.addEventListener("submit", searchNationalParkWeather);
