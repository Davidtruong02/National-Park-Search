//--------------------------------------------------------------------------------------------------------------------------------------------//
//                                                                 State Selector                                                             //
//--------------------------------------------------------------------------------------------------------------------------------------------//

var btn1 = document.getElementById('search');

const states = [
    { name: "Alabama", abbr: "AL" },
    { name: "Alaska", abbr: "AK" },
    { name: "Arizona", abbr: "AZ" },
    { name: "Arkansas", abbr: "AR" },
    { name: "California", abbr: "CA" },
    { name: "Colorado", abbr: "CO" },
    { name: "Connecticut", abbr: "CT" },
    { name: "Delaware", abbr: "DE" },
    { name: "District of Columbia", abbr: "DC" },
    { name: "Florida", abbr: "FL" },
    { name: "Georgia", abbr: "GA" },
    { name: "Hawaii", abbr: "HI" },
    { name: "Idaho", abbr: "ID" },
    { name: "Illinois", abbr: "IL" },
    { name: "Indiana", abbr: "IN" },
    { name: "Iowa", abbr: "IA" },
    { name: "Kansas", abbr: "KS" },
    { name: "Kentucky", abbr: "KY" },
    { name: "Louisiana", abbr: "LA" },
    { name: "Maine", abbr: "ME" },
    { name: "Maryland", abbr: "MD" },
    { name: "Massachusetts", abbr: "MA" },
    { name: "Michigan", abbr: "MI" },
    { name: "Minnesota", abbr: "MN" },
    { name: "Mississippi", abbr: "MS" },
    { name: "Missouri", abbr: "MO" },
    { name: "Montana", abbr: "MT" },
    { name: "Nebraska", abbr: "NE" },
    { name: "Nevada", abbr: "NV" },
    { name: "New Hampshire", abbr: "NH" },
    { name: "New Jersey", abbr: "NJ" },
    { name: "New Mexico", abbr: "NM" },
    { name: "New York", abbr: "NY" },
    { name: "North Carolina", abbr: "NC" },
    { name: "North Dakota", abbr: "ND" },
    { name: "Ohio", abbr: "OH" },
    { name: "Oklahoma", abbr: "OK" },
    { name: "Oregon", abbr: "OR" },
    { name: "Pennsylvania", abbr: "PA" },
    { name: "Rhode Island", abbr: "RI" },
    { name: "South Carolina", abbr: "SC" },
    { name: "South Dakota", abbr: "SD" },
    { name: "Tennessee", abbr: "TN" },
    { name: "Texas", abbr: "TX" },
    { name: "Utah", abbr: "UT" },
    { name: "Vermont", abbr: "VT" },
    { name: "Virgin Islands", abbr: "VI" },
    { name: "Virginia", abbr: "VA" },
    { name: "Washington", abbr: "WA" },
    { name: "West Virginia", abbr: "WV" },
    { name: "Wisconsin", abbr: "WI" },
    { name: "Wyoming", abbr: "WY" },
  ];
  
  const stateInput = document.getElementById("stateInput");

  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.abbr;
    option.textContent = state.name;
    stateInput.appendChild(option);
  });

// Add event listener to stateInput element
stateInput.addEventListener('change', (event) => {
  const selectedState = event.target.value;

  if (selectedState) {
    const selectedStateObj = states.find(state => state.abbr === selectedState);

    if (selectedStateObj) {
      const selectedStateJson = JSON.stringify({ abbr: selectedState});
      localStorage.setItem('selectedState', selectedStateJson);
    } else {
      console.log('State not found in the states array');
    }
  }
});
//--------------------------------------------------------------------------------------------------------------------------------------------//
//                                                                     WEATHER API                                                              //
//--------------------------------------------------------------------------------------------------------------------------------------------//



const weatherApiKey = '7b81d4dd82747d9a1553232e25c5c450';

async function getWeatherForecast(lat, lon) {
  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`;

  return fetch(weatherApiUrl)
      .then(response => response.json())
      .then(data => {
          const forecastList = data.list;

          // Group forecast data by day
          const dailyForecasts = {};
          forecastList.forEach(forecast => {
              const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];
              if (!dailyForecasts[date]) {
                  dailyForecasts[date] = [];
              }
              dailyForecasts[date].push(forecast);
          });

          // Extract one forecast per day (assuming 3-hour intervals)
          const dailyForecast = Object.values(dailyForecasts).map(dayForecasts => dayForecasts[0]);

          return dailyForecast;
      })
      .catch(error => {
          console.error('Error fetching weather data:', error);
          return [];
      });
    }




//--------------------------------------------------------------------------------------------------------------------------------------------//
//                                                                     NPS API                                                                //
//--------------------------------------------------------------------------------------------------------------------------------------------//




btn1.addEventListener('click', (e) => {
  e.preventDefault();
  const npsApiKey = "x8MurMnpRvI0zVQH0bsTRh6vhu0wtxtHWZTpXPkd";
  const selectedStateAbbr = stateInput.value;
  const apiUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${selectedStateAbbr}&api_key=`+npsApiKey;
  const selectedDate = document.querySelector('input[name="arrival-date"]').value;
 
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const parks = data.data.slice(0, 3);
      parkContainer.innerHTML = '';
      parks.forEach(async park => {
        const parkDiv = document.createElement('div');
        parkDiv.classList.add('park-container');


        const weatherData = await getWeatherForecast(park.latitude, park.longitude, selectedDate);
        console.log('Weather Data for Park:', weatherData); // Log weather data
        
        parkDiv.innerHTML = `
          <h2>${park.fullName}</h2>
          <p>${park.description}</p>
          <a href="${park.url}" target="_blank">Visit Park Website</a>
        `;

        const weatherContainer = document.createElement('div');
        weatherContainer.innerHTML = `<h3>5-Day Weather Forecast:</h3>`;
        weatherContainer.innerHTML += renderWeatherForecast(weatherData);
        weatherContainer.classList.add('weather-info'); // Add a class for styling
        parkDiv.appendChild(weatherContainer);

        parkContainer.appendChild(parkDiv);

      });
    })
})


function convertCelsiusToFahrenheit(celsius) {
  return (celsius - 273.15) * 9/5 + 32;
}

function renderWeatherForecast(weatherData) {
  console.log('Weather Data:', weatherData); // Log weather data

  if (!weatherData || weatherData.length === 0) {
      return '<p>Weather data not available</p>';
  }

  // Skip the first item (current weather) and only consider the forecast
  const forecastData = weatherData.slice(1);

  return forecastData.map(day => {
      // Extract relevant information from the forecast object
      const date = new Date(day.dt * 1000).toDateString();
      const celsiusTemperature = day.temp ? day.temp.day : (day.main ? day.main.temp : 'N/A');
      const fahrenheitTemperature = convertCelsiusToFahrenheit(celsiusTemperature);
      const description = day.weather && day.weather.length > 0 ? day.weather[0].description : 'N/A';

      // Construct HTML for each day's forecast
      return `
          <div class="weather-forecast">
              <p> <img src="https://openweathermap.org/img/w/${day.weather[0].icon}.png" alt="${description}" /> </p>
              <p>Date: ${date}</p>
              <p>Temperature: ${fahrenheitTemperature.toFixed(2)} °F</p>
              <p>Description: ${description}</p>
          </div>
      `;
  }).join('');
}


// //--------------------------------------------------------------------------------------------------------------------------------------------//
// //                                                                 State Selector                                                             //
// //--------------------------------------------------------------------------------------------------------------------------------------------//

// var btn1 = document.getElementById('search');

// const states = [
//     { name: "Alabama", abbr: "AL" },
//     { name: "Alaska", abbr: "AK" },
//     { name: "Arizona", abbr: "AZ" },
//     { name: "Arkansas", abbr: "AR" },
//     { name: "California", abbr: "CA" },
//     { name: "Colorado", abbr: "CO" },
//     { name: "Connecticut", abbr: "CT" },
//     { name: "Delaware", abbr: "DE" },
//     { name: "District of Columbia", abbr: "DC" },
//     { name: "Florida", abbr: "FL" },
//     { name: "Georgia", abbr: "GA" },
//     { name: "Hawaii", abbr: "HI" },
//     { name: "Idaho", abbr: "ID" },
//     { name: "Illinois", abbr: "IL" },
//     { name: "Indiana", abbr: "IN" },
//     { name: "Iowa", abbr: "IA" },
//     { name: "Kansas", abbr: "KS" },
//     { name: "Kentucky", abbr: "KY" },
//     { name: "Louisiana", abbr: "LA" },
//     { name: "Maine", abbr: "ME" },
//     { name: "Maryland", abbr: "MD" },
//     { name: "Massachusetts", abbr: "MA" },
//     { name: "Michigan", abbr: "MI" },
//     { name: "Minnesota", abbr: "MN" },
//     { name: "Mississippi", abbr: "MS" },
//     { name: "Missouri", abbr: "MO" },
//     { name: "Montana", abbr: "MT" },
//     { name: "Nebraska", abbr: "NE" },
//     { name: "Nevada", abbr: "NV" },
//     { name: "New Hampshire", abbr: "NH" },
//     { name: "New Jersey", abbr: "NJ" },
//     { name: "New Mexico", abbr: "NM" },
//     { name: "New York", abbr: "NY" },
//     { name: "North Carolina", abbr: "NC" },
//     { name: "North Dakota", abbr: "ND" },
//     { name: "Ohio", abbr: "OH" },
//     { name: "Oklahoma", abbr: "OK" },
//     { name: "Oregon", abbr: "OR" },
//     { name: "Pennsylvania", abbr: "PA" },
//     { name: "Rhode Island", abbr: "RI" },
//     { name: "South Carolina", abbr: "SC" },
//     { name: "South Dakota", abbr: "SD" },
//     { name: "Tennessee", abbr: "TN" },
//     { name: "Texas", abbr: "TX" },
//     { name: "Utah", abbr: "UT" },
//     { name: "Vermont", abbr: "VT" },
//     { name: "Virginia", abbr: "VA" },
//     { name: "Washington", abbr: "WA" },
//     { name: "West Virginia", abbr: "WV" },
//     { name: "Wisconsin", abbr: "WI" },
//     { name: "Wyoming", abbr: "WY" },
//   ];
  
//   const stateInput = document.getElementById("stateInput");

  
//   states.forEach((state) => {
//     const option = document.createElement("option");
//     option.value = state.abbr;
//     option.textContent = state.name;
//     stateInput.appendChild(option);
//   });

// // Add event listener to stateInput element
// stateInput.addEventListener('change', (event) => {
//   const selectedState = event.target.value;

//   if (selectedState) {
//     const selectedStateObj = states.find(state => state.abbr === selectedState);

//     if (selectedStateObj) {
//       const selectedStateJson = JSON.stringify({ abbr: selectedState});
//       localStorage.setItem('selectedState', selectedStateJson);
//     } else {
//       console.log('State not found in the states array');
//     }
//   }
// });










// //--------------------------------------------------------------------------------------------------------------------------------------------//
// //                                                                  Weather API                                                               //
// //--------------------------------------------------------------------------------------------------------------------------------------------//

// const apiKey = "151fee77ec9df13d3f8e8d88f6890fc2";
// const mapQuestApiKey = "ej1jF6SPfaZl671vKt3mUoMxw2Cdj7iV";
// const searchForm = document.getElementById("input-container");
// const forecastInfo = document.getElementById("forecast-container");
// const units = "imperial";

// async function searchNationalParkWeather(event) {
//   event.preventDefault();
//   console.log("HELLO THERE, THIS IS SEARCH NATIONAL PARK WEATHER");

//   const parkInput = document.getElementById("parkInput");
//   const parkName = parkInput.value.trim();

//   if (parkName === "") {
//     alert("Please enter a National Park name.");
//     return;
//   }

//   try {
//     const location = await getCoordinates(parkName);
//     const [lat, lon] = location.split(",");
//     const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
//     const forecastResponse = await fetch(forecastApiUrl);
//     const forecastData = await forecastResponse.json();

//     forecastInfo.innerHTML = '<h2>5-Day Weather Forecast</h2>';

//     for (let i = 0; i < forecastData.list.length; i += 8) {
//       const forecast = forecastData.list[i];
//       const date = new Date(forecast.dt * 1000);
//       const day = date.toLocaleDateString("en-US", { weekday: "long" });

//       forecastInfo.innerHTML += `
//         <div class="forecast-day">
//           <p>${day}</p>
//           <p> <img src="https://openweathermap.org/img/w/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}" /> </p>
//           <p>Temperature: ${forecast.main.temp} °F</p>
//           <p>Humidity: ${forecast.main.humidity}%</p>
//           <p>Wind Speed: ${forecast.wind.speed} m/s</p>
//         </div>
//       `;
//     }
//   } catch (error) {
//     console.error("Error fetching weather data:", error);
//   }
// }

// async function getCoordinates(parkName) {
//   const geocodingApiUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=${mapQuestApiKey}&location=${parkName}`;
//   const response = await fetch(geocodingApiUrl);
//   const data = await response.json();

//   if (
//     data.results &&
//     data.results[0] &&
//     data.results[0].locations &&
//     data.results[0].locations[0]
//   ) {
//     return `${data.results[0].locations[0].latLng.lat},${data.results[0].locations[0].latLng.lng}`;
//   } else {
//     throw new Error(
//       "Unable to fetch coordinates for the specified National Park."
//     );
//   }
// }

// searchForm.addEventListener("submit", searchNationalParkWeather);



//--------------------------------------------------------------------------------------------------------------------------------------------//
//                                                                     NPS API                                                                //
//--------------------------------------------------------------------------------------------------------------------------------------------//



// Variable to store the NPS API key
// const npsApiKey = "x8MurMnpRvI0zVQH0bsTRh6vhu0wtxtHWZTpXPkd";

// function fetchNPSData() {
//     const selectedStateJson = localStorage.getItem("selectedState");
//     const selectedStateObj = JSON.parse(selectedStateJson);
//     const selectedStateAbbr = selectedStateObj.abbr;
//     const npsApiKey = "x8MurMnpRvI0zVQH0bsTRh6vhu0wtxtHWZTpXPkd";
//     const apiUrl = 'https://developer.nps.gov/api/v1/parks?stateCode='+selectedStateAbbr+'&api_key='+npsApiKey;
  
//     fetch(apiUrl)
//       .then(res => res.json())
//       .then(data => {
//         const npsData = data.data.map(item => ({
//           fullName: item.fullName,
//           description: item.description,
//           latitude: item.latitude,
//           longitude: item.longitude,
//           url: item.url
//         }));
  
//         const npsDataJson = JSON.stringify(npsData);
//         localStorage.setItem('npsData', npsDataJson);
  
//         console.log(npsData);
//       })
//       .catch((error) => {
//         console.error("Error fetching NPS data:", error);
//       });
//   }

//   function createNPSDataCards() {
//     const npsDataJson = localStorage.getItem("npsData");
//     const npsData = JSON.parse(npsDataJson);
  
//     const container = document.getElementById("npsDataContainer");
  
//     npsData.forEach(item => {
//       const card = document.createElement("div");
//       card.classList.add("npsData");
  
//       const header = document.createElement("h2");
//       header.textContent = item.fullName;
//       card.appendChild(header);
  
//       const description = document.createElement("p");
//       description.textContent = item.description;
//       card.appendChild(description);
  
//       const url = document.createElement("a");
//       url.textContent = "Visit Website";
//       url.href = item.url;
//       card.appendChild(url);
  
//       container.appendChild(card);
//     });
//   }

  


  
// btn1.addEventListener('click', (event) => {
//   event.preventDefault();
//   searchNationalParkWeather();
//   fetchNPSData();
//   createNPSDataCards();

//   const selectedState = stateInput.value;

//   if (selectedState) {
//     const selectedStateObj = states.find(state => state.abbr === selectedState);

//     if (selectedStateObj) {
//       const selectedStateJson = JSON.stringify({ abbr: selectedState});
//       localStorage.setItem('selectedState', selectedStateJson);
//     } else {
//       console.log('State not found in the states array');
//     }
//   }
// });

