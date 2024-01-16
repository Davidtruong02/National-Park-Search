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
  

  //--------------------------------------------------------------------------------------------------------------------------------------------//
//                                                                     NPS API                                                                //
//--------------------------------------------------------------------------------------------------------------------------------------------//




const searchButton = document.getElementById('search');
const npsApiKey = "x8MurMnpRvI0zVQH0bsTRh6vhu0wtxtHWZTpXPkd";
const parkContainer = document.getElementById('parkContainer');

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  const selectedStateAbbr = stateInput.value;
  const apiUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${selectedStateAbbr}&api_key=`+npsApiKey;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const parks = data.data;
      parkContainer.innerHTML = '';
      parks.forEach(park => {
        const parkDiv = document.createElement('div');
        parkDiv.id = 'parkInfo';
        parkDiv.innerHTML = `
          <h2>${park.fullName}</h2>
          <p>${park.description}</p>
          <a href="${park.url}" target="_blank">Visit Park Website</a>
        `;
        parkContainer.appendChild(parkDiv);
      });
    })
    .catch(error => console.error(error));
});

// Step 1: Obtain an API key
// const apiKey = '151fee77ec9df13d3f8e8d88f6890fc2';







