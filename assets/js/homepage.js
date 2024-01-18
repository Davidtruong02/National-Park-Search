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

async function getWeatherForecast(lat, lon,) {
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

    function convertCelsiusToFahrenheit(celsius) {
      return (celsius - 273.15) * 9/5 + 32;
    }
    
    function renderWeatherForecast(weatherData) {
    
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
      const parks = data.data;
      parkContainer.innerHTML = '';

      // Create an array of promises for the weather data
      const arrivalDate = document.querySelector('#arrivalDate').value;
      const weatherPromises = parks.map(park => getWeatherForecast(park.latitude, park.longitude, arrivalDate));

      // Wait for all the promises to resolve
      Promise.all(weatherPromises)
        .then(weatherDataArray => {
          // Sort the parks by name
          parks.sort((a, b) => a.fullName.localeCompare(b.fullName));

          // Display the parks
          parks.forEach((park, index) => {
            const parkDiv = document.createElement('details');
            parkDiv.classList.add('park-container');

            // If it's the first park, add the 'open' attribute
            if (index === 0) {
              parkDiv.setAttribute('open', '');
            }

            const summary = document.createElement('summary');
            summary.classList.add('summary-width', 'park-name');
            summary.textContent = park.fullName;
            parkDiv.appendChild(summary);

            const parkInfo = document.createElement('div');
            parkInfo.innerHTML = `
              <p>${park.description}</p>
              <a href="${park.url}" target="_blank">Visit Park Website</a>
            `;
            parkDiv.appendChild(parkInfo);

            const weatherContainer = document.createElement('div');
            weatherContainer.innerHTML = renderWeatherForecast(weatherDataArray[index]);
            weatherContainer.classList.add('weather-info'); // Add a class for styling
            parkDiv.appendChild(weatherContainer);

            parkContainer.appendChild(parkDiv);
          });
        });
    })
})
 






