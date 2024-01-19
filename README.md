# National-Park-Search
## Description

This project was created to test our knowledge of handeling all the programing languages we have learned up to this point.  

- We used HTML to create the "bones" of our page
- We used CSS to give our page it's look 
- We used JS to handle all of our background processes and incorporate our data into our HTML
- We called 2 APIs to retireve the data for our page. 


## Table of Contents 

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)

## Installation

To pull the rep files:
1. Go to my git hub repo (https://github.com/dstorie80/BC_C6_Forecast)
2. Click on the code button and select SSH
3. navigate git bash to a designated folder of your chosing (CD <filepath/> [if a new folder needs to be created, you can use the mkdir command in git bash])
4. Pull the latest update from git using the clone command in git bash (git clone <repo url>)
5. Once the repo has been downloaded into the folder, you can use open vs code (code . in git bash) to open the files from the repo



## Usage

To access the website you will need to follow this published link - [https://dstorie80.github.io/BC_C6_Forecast/](https://davidtruong02.github.io/National-Park-Search/)

To access the latest repo you will need to follow this github rep link - ([[https://github.com/dstorie80/BC_C6_Forecast.git](https://github.com/Davidtruong02/National-Park-Search.git)](https://github.com/Davidtruong02/National-Park-Search.git))

To start, you will be presented with a search container with a drop box to pick a state and the arrival date calendar selection. 

![image](https://github.com/Davidtruong02/National-Park-Search/assets/149905416/fa2145ff-273e-4e3e-b7ac-de0998ea45dc)

By clicking on the drop down list, you can select a US state.

![image](https://github.com/Davidtruong02/National-Park-Search/assets/149905416/b0628fe1-ba3a-49b2-83e7-6a5eba51ccf9)

Once a state is seleced, the user can select an arrival date.  (at this time the arrival date does not function as intended due to API limitations).  The selected date will help with the search results in the following steps.  

![image](https://github.com/Davidtruong02/National-Park-Search/assets/149905416/5cc25b88-df69-4b1c-8721-5a9695ee4f07)

Once the state and date are selected the user can click on the search button to display the results of the state parks.

![image](https://github.com/Davidtruong02/National-Park-Search/assets/149905416/326eb2ef-2a64-48f8-acc9-99c94314737d)

The results are displayed in an accordian style so that we can return all of the results for each state as we were originally limited in space.  

Each item in the according gives the state park name, a short descrition, the url to the NPS data for the state park, and a 5 day forecast.  (The 5 day forecast should be powerd by the arrival date, but as the API requiers a paied subscription for anything over 5 days past current it was not implemented in this release). 

![image](https://github.com/Davidtruong02/National-Park-Search/assets/149905416/6a9988a3-d32f-4638-b8a9-89a1193abad7)











## Credits

The API used to get the data came from the project readme file:

https://developer.nps.gove/api
https://openweathermap.org



## License

MIT license was used for this project. 
