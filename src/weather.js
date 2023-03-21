const API_KEY = "67fe3285486a7f123b0fb08665aa9d51";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/onecall";
let clothingVisible = true;
const getWeatherBtn = document.getElementById("get-weather-btn");
const cityListElement = document.getElementById('city-list');
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const weatherIcon = document.getElementById("weather-icon");
const condition = document.getElementById("condition");
const details = document.getElementById("details");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const windSpeed = document.getElementById("wind-speed");
// const pressure = document.getElementById("pressure");
const temperatureElement = document.getElementById("temperature");

// Add an event listener to the input field to detect when the user enters text
cityInput.addEventListener("input", function () {
  const city = cityInput.value.trim(); // Remove any leading/trailing whitespace
  if (city.length > 0) {
    // If the input field is not empty, make an API call to find matching cities and their weather information
    const url = `https://api.openweathermap.org/data/2.5/find?q=${ encodeURIComponent(city) }&appid=${ API_KEY }`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Clear the previous options
        cityListElement.innerHTML = "";
        // Loop through the list of matching cities and append their name and country code as options to the datalist element
        for (let item of data.list) {
          const cityName = item.name;
          const countryName = item.sys.country;
          const optionElement = document.createElement("option");
          optionElement.value = `${ cityName }, ${ countryName }, ${ item.coord.lat }, ${ item.coord.lon }`;
          cityListElement.appendChild(optionElement);
        }
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    // If the input field is empty, clear the datalist and weather output elements
    cityListElement.innerHTML = "";
  }
});

// add event listener for click event
getWeatherBtn.addEventListener("click", getWeather);

// add event listener for keypress event
cityInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    getWeather();
  }
});

// hide or show weather info
const weatherInfoContainer = document.querySelector('.weather-info-container');
const CityName1 = document.querySelector('#city-name');

function showWeatherInfo() {
  // Check if cityName is empty
  if (CityName1.textContent.trim() === "") {
    // Hide weatherInfoContainer using hidden attribute
    weatherInfoContainer.setAttribute('hidden', true);
  } else {
    // Show weatherInfoContainer by removing hidden attribute
    weatherInfoContainer.removeAttribute('hidden');
  }
}

function hideClothing() {
  
  if(clothingVisible) {
    const clothesImages = document.getElementById("clothes-images").querySelectorAll("img");
    for (let i = 0; i < clothesImages.length; i++) {
      clothesImages[i].style.display = "none";
    }
    document.getElementById("rainboots-image").style.display = "none";
    document.getElementById("umbrella-image").style.display = "none";
    clothingVisible = false;
    return;
  }

  getWeather();
  clothingVisible = true;
}

// Listen for changes to the city name input
CityName1.addEventListener('DOMSubtreeModified', showWeatherInfo);

function getWeather() {

}
//functions for the user to add a city to their favorites
