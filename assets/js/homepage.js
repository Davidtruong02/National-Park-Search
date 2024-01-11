const apiKey = "151fee77ec9df13d3f8e8d88f6890fc2";
const mapQuestApiKey = "ej1jF6SPfaZl671vKt3mUoMxw2Cdj7iV";
var weatherInfo = document.getElementById("current-weather");
var searchForm = document.getElementById("input-container");
var forecastInfo = document.getElementById("forecast-container");
var weatherInfo = document.getElementById("weather-container");
var units = "imperial";



async function searchNationalParkWeather(event) {
  event.preventDefault();

  const parkInput = document.getElementById("parkInput");
  const parkName = parkInput.value.trim();

  if (parkName === "") {
    alert("Please enter a National Park name.");
    return;
  }

  try {
    const location = await getCoordinates(parkName);
    const [lat, lon] = location.split(",");
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

    const response = await fetch(weatherApiUrl);
    const data = await response.json();


    displayCurrentWeather(parkName,data);
    await displayForecastWeather(lat,lon);
} catch (error) {
    console.error("Error fetching weather data:", error);
  }
    
    
    function displayCurrentWeather(parkName,data) {
    weatherInfo.innerHTML = `
            <h2>${parkName} weather</h2>
            <p>Current Weather: ${data.weather[0].main}</p>
            <p> <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}"></p>
            <p>Temperature: ${data.main.temp} °F</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
 }
}









// Function to get coordinates using MapQuest Geocoding API
async function getCoordinates(parkName) {
  const mapQuestApiKey = "ej1jF6SPfaZl671vKt3mUoMxw2Cdj7iV";
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
