// const API_KEY = "9ac40eb25495f48e470b86839c4e8a4b";
// const API_KEY = "9336659e97dc88345c4e1df3f8b2dca9";
// const API_KEY = "0fb98056d14c0b3b443c610b4ebe30e9";
const API_KEY = "b954dc65c5ccd233e352b2ff1ba92d2c";

const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/onecall";

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
const forecastList = document.getElementById("forecast-list");
const temperatureElement = document.getElementById("temperature");
const list = document.getElementById("search-list")
const clothingOptions = document.getElementById("options");
let recommendedClothes = "";
let clothingVisible = true;
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
const MAX_ITEMS = 10;

// // add event listener for click event
// getWeatherBtn.addEventListener("click", getWeather);

// // add event listener for keypress event
// cityInput.addEventListener("keypress", function (event) {
//   if (event.key === "Enter") {
//     if (cityInput.value === "") {
//       alert("Please enter a city name");
//       return;
//     }
//     getWeather();
//   }
// });





// 29-Mar test code start

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const cityList = document.getElementById("city-lists");
const notFound = document.getElementById("not-found");

// Fetch weather data from OpenWeatherMap API
const fetchWeatherData = async (cityId) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?id=${ cityId }&appid=${ API_KEY }`
  );
  if (response.ok) {
    const data = await response.json();
    return [ data ];
  } else {
    throw new Error("City not found");
  }
};

const fetchCityId = async (cityName) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/find?q=${ cityName }&appid=${ API_KEY }`
  );
  if (response.ok) {
    const data = await response.json();
    if (data.list.length > 0) {
      return data.list.map((city) => city.id);
    } else {
      throw new Error("City not found");
    }
  } else {
    throw new Error("City not found");
  }
};

const addCityToList = (city) => {
  const { name, sys: { country }, coord: { lat, lon } } = city;
  const li = document.createElement("li");
  const button = document.createElement("button");

  button.textContent = `${name}, ${country} ${Math.round(city.main.temp - 273.15)}°C (${lat}, ${lon})`;
  button.addEventListener("click", () => {
    fetchWeatherData(city.id)
      .then((data) => {
        getWeather(data[0]);
      })
  });
  li.appendChild(button);
  cityList.appendChild(li);
};



// Clear the list
const clearCityList = () => {
  cityList.innerHTML = "";
};

// Show the "Not found" message
const showNotFound = () => {
  notFound.style.display = "block";
  alert("City not found, make sure you spelled the city name correctly, alternativly, that city has not been added to the api.");
};

// Hide the "Not found" message
const hideNotFound = () => {
  notFound.style.display = "none";
};

// Handle search button click event
searchButton.addEventListener("click", () => {
  const cityName = searchInput.value.trim();
  if (cityName) {
    clearCityList();
    hideNotFound(); // hide the "Not found" message
    fetchCityId(cityName)
      .then((cityIds) => {
        cityIds.forEach((cityId) => {
          fetchWeatherData(cityId)
            .then((data) => {
              if (data.length > 0) {
                data.forEach(addCityToList);
              } else {
                showNotFound();
              }
            })
            .catch(() => {
              showNotFound();
            });
        });
      })
      .catch(() => {
        showNotFound();
      });
  }
});

// Handle search input key press event
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});

function getWeather(data) {
  cityName.textContent = data.name;
  weatherIcon.src = `https://api.openweathermap.org/img/w/${ data.weather[ 0 ].icon }.png`;
  condition.textContent = data.weather[ 0 ].main;
  details.textContent = data.weather[ 0 ].description;
  sunrise.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
  sunset.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
  windSpeed.textContent = data.wind.speed;

  // recommend clothes based on weather and temperature
  const temperature = data.main.temp;
  temperatureElement.textContent = `${ Math.round(data.main.temp - 273.15) }°C`;
  const weatherCondition = data.weather[ 0 ].main;

  showClothes(temperature, weatherCondition);
  hideClothing();
}

function hideClothing() {
  const toggleBtn = document.getElementById("clothing-toggle");
  const clothesImages = document.getElementById("clothes-images").querySelectorAll("img");
  if (toggleBtn.checked) {
    for (let i = 0; i < clothesImages.length; i++) {
      clothesImages[ i ].style.visibility = "hidden";
    }
    clothingVisible = false;
  } else {
    for (let i = 0; i < clothesImages.length; i++) {
      clothesImages[ i ].style.visibility = "visible";
    }
    clothingVisible = true;
  }
}

// 29-Mar test code end







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

// Listen for changes to the city name input
CityName1.addEventListener('DOMSubtreeModified', showWeatherInfo);



function showClothes(temperature, weatherCondition) {
  recommendedClothes = "";
  // Select all images within the clothes-images div
  const topsElement = document.getElementById("tops");
  const bottomsElement = document.getElementById("bottoms");
  const footwearElement = document.getElementById("footwear");
  const accessoriesElement = document.getElementById("accessories");

  if (temperature > 20) {
    recommendedClothes = "shorts, t-shirt, and sandals.";

    topsElement.innerHTML = `<img id="shirt-image" src="../Images/tops/shirts/shirtNoColor.png" alt="Shirt" style="z-index: 1">`;

    bottomsElement.innerHTML = `<img id="shorts-image" src="../Images/bottoms/shortsNoColor.png" alt="Shorts" style="z-index: 1">`;

    footwearElement.innerHTML = `<img id="sandals-image" src="../Images/footwear/sandals.png" alt="Sandals" style="z-index: 1">`;

    accessoriesElement.innerHTML = ``;

  } else if (temperature > 10) {
    recommendedClothes = "a light jacket, pants, and sneakers";

    topsElement.innerHTML = `<img id="light-jacket-image" src="../Images/tops/Jacket/hoodieBlue.png" alt="Hoodie" style="z-index: 1">`;

    bottomsElement.innerHTML = `<img id="pants-image" src="../Images/bottoms/jeansRipped.png" alt="Pants" style="z-index: 1">`;

    footwearElement.innerHTML = `<img id="shoes-image" src="../Images/footwear/shoesColor.png" alt="Shoes" style="z-index: 1">`;

    accessoriesElement.innerHTML = ``;

  } else {
    recommendedClothes = "a heavy jacket, pants, and boots.";

    topsElement.innerHTML = `<img id="jacket-image" src="../Images/tops/Jacket/jacketRedPuffer.png" alt="Jacket" style="z-index: 1">`;

    bottomsElement.innerHTML = `<img id="pants-image" src="../Images/bottoms/jeans.png" alt="Pants" style="z-index: 1">`;

    footwearElement.innerHTML = `<img id="heavy-boots-image" src="../Images/footwear/heavy-boots.png" alt="Boots" style="z-index: 1">`;

    accessoriesElement.innerHTML = ``;
  }

  if (weatherCondition === "Rain") {
    recommendedClothes += " with rainboots and an umbrella";

    topsElement.innerHTML = `<img id="jacket-image" src="../Images/tops/Jacket/jacketRedPuffer.png" alt="Jacket" style="z-index: 1">`;

    bottomsElement.innerHTML = `<img id="pants-image" src="../Images/bottoms/jeans.png" alt="Pants" style="z-index: 1">`;

    footwearElement.innerHTML = `<img id="rainboots-image" src="../Images/footwear/rain-boots.png" alt="Boots" style="z-index: 1">`;

    accessoriesElement.innerHTML = `<img id="umbrella-image" src="../Images/accessories/umbrella.png" alt="Umbrella" style="z-index: 1">`;

  }

  const recommendedClothesElement = document.getElementById("recommended-clothes");
  recommendedClothesElement.textContent = recommendedClothes;
}


// function hideSearchHistoryDropdown() {
//   list.style.display = "none";
// }
// function showSearchHistoryDropdown() {
//   list.style.display = "block";
// }
// function populateSearchHistoryDropdown() {
//   list.innerHTML = "";
//   searchHistory.forEach((searchedItem) => {
//     let a = document.createElement("a");
//     let br = document.createElement("br");
//     a.innerHTML = searchedItem;
//     a.classList.add("list-item")
//     a.onclick = () => { cityInput.value = a.innerHTML; list.innerHTML = ""; }
//     list.appendChild(a);
//     list.appendChild(br);
//   });
// }

// cityInput.onfocus = () => {
//   populateSearchHistoryDropdown();
//   showSearchHistoryDropdown();
// };

// cityInput.onblur = () => {
//   setTimeout(hideSearchHistoryDropdown, 200);
// };


function topSelection() {
  //populate 4 images of tops for the user to look at
  clothingOptions.innerHTML = "";
  if (recommendedClothes.includes("shirt")) {
    clothingOptions.innerHTML += `<img id="shirt-image1" src="../Images/tops/shirts/shirtNoColor.png" alt="Shirt" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="shirt-image2" src="../Images/tops/shirts/BlouseNoColor.png" alt="Shirt" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="shirt-image3" src="../Images/tops/shirts/tshirtNoColor.png" alt="Shirt" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="shirt-image4" src="../Images/tops/shirts/sweaterNoColor.png" alt="Shirt" style="z-index: 1">`;
  } else if (recommendedClothes.includes("jacket")) {
    clothingOptions.innerHTML += `<img id="jacket-image1" src="../Images/tops/Jacket/coatLeather.png" alt="Jacket" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="jacket-image2" src="../Images/tops/Jacket/hoodieBlue.png" alt="Jacket" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="jacket-image3" src="../Images/tops/Jacket/jacketRedPuffer.png" alt="Jacket" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="jacket-image4" src="../Images/tops/Jacket/jacket.png" alt="Jacket" style="z-index: 1">`;
  }
}
function bottomSelection() {
  //populate 4 images of bottoms for the user to look at
  clothingOptions.innerHTML = "";
  if (recommendedClothes.includes("shorts")) {
    clothingOptions.innerHTML += `<img id="shorts-image1" src="../Images/bottoms/shortsNoColor.png" alt="Shorts" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="shorts-image1" src="../Images/bottoms/skirtNoColor.png" alt="Shorts" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="shorts-image1" src="../Images/bottoms/denim-shortsColor.png" alt="Shorts" style="z-index: 1">`;
  } else if (recommendedClothes.includes("pants")) {
    clothingOptions.innerHTML += `<img id="pants-image1" src="../Images/bottoms/jeansRipped.png" alt="Pants" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="pants-image1" src="../Images/bottoms/trousersNoColor.png" alt="Pants" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="pants-image1" src="../Images/bottoms/trousersOrange.png" alt="Pants" style="z-index: 1">`;
  }
}
function footSelection() {
  //populate 4 images of footwear for the user to look at
  clothingOptions.innerHTML = "";
  if (recommendedClothes.includes("boots")) {
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/boots.png" alt="Footwear" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/heavy-boots.png" alt="Footwear" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/rain-boots.png" alt="Footwear" style="z-index: 1">`;
  } else if (recommendedClothes.includes("sneakers")) {
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/shoesColor.png" alt="Footwear" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/jordans.png" alt="Footwear" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/jordans2.png" alt="Footwear" style="z-index: 1">`;
  } else if (recommendedClothes.includes("sandals")) {
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/shoesColor.png" alt="Footwear" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/jordans.png" alt="Footwear" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="footwear-image1" src="../Images/footwear/jordans2.png" alt="Footwear" style="z-index: 1">`;
  }
}
function accSelection() {
  //populate 4 images of accessories for the user to look at
  clothingOptions.innerHTML = "";
  if (recommendedClothes.includes("umbrella")) {
    clothingOptions.innerHTML += `<img id="acc-image1" src="../Images/accessories/umbrella.png" alt="Umbrella" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="acc-image1" src="../Images/accessories/umbrella2.png" alt="Umbrella" style="z-index: 1">`;
    clothingOptions.innerHTML += `<img id="acc-image1" src="../Images/accessories/umbrella3.png" alt="Umbrella" style="z-index: 1">`;
  }
}