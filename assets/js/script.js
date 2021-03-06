var recentCitySearch = [];

//Function for setting cities into local storage
var setCitiesSearched = function () {
  //Sets city name into local storage
  localStorage.setItem("citySearch", JSON.stringify(recentCitySearch));
};

//Function for getting cities from local storage
var getCitiesSearched = function () {
  var storedCities = localStorage.getItem("citySearch")
  if (storedCities) {
    recentCitySearch = JSON.parse(storedCities);
  }

  //Appends every city from local storage under cities searched
  for (var i = 0; i < recentCitySearch.length; i++) {
    $("#citiesSearched").append("<p><button class='btn'>" + recentCitySearch[i] + "</button></p>");
  }
};

//Function that empties all content in the appropriate IDs
var emptyContent = function () {
  $("#cityName").empty();
  $("#currentDate").empty();
  $("#currentTemp").empty();
  $("#currentWind").empty();
  $("#currentHumidity").empty();
  $("#uvIndex").empty();
  $("#fiveDayForecast").empty();
  $("#fiveDayInfo").empty();
};

//Function that gets weather based on city name entered by user
var getWeather = function () {
  //Obtains city from user input
  var city = $("#city").val();

  //Push city name into recentCitySearch array
  recentCitySearch.push(city);

  //Runs setCitiesSearched function to save the city searched into local storage
  setCitiesSearched();

  //Appends the city name as a button under the search and clear recent cities button
  $("#citiesSearched").append("<p><button class='btn'>" + city + "</button></p>");

  //API for obtaining longitude and latitude from city provided by user
  fetch("https://api.geocod.io/v1.6/geocode?q=" + city + "&api_key=aa7f4c6a6166d8fce4f1668ddc688768471fd68")
    .then(function (response) { return response.json() })
    .then(function (result) {

      //Saves the longitude and latitude results from the API response into created variables
      var lon = result.results[0].location.lng;
      var lat = result.results[0].location.lat;

      //Saves the city and state results from the API response into created variables
      var currCity = result.results[0].address_components.city;
      var currState = result.results[0].address_components.state;

      //Variable created for current date
      var currDate = moment().format('L');

      //Appends city, state, and current date into element with an id=cityName
      $("#cityName").append(currCity + ", " + currState + "  (" + currDate + ")");

      //API for obtaining weather by using the latitude and longitude from variables above
      fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=66234c6444c4ec62b6a55ecddd9501b0")
        .then(function (responseWeather) {
          return responseWeather.json();
        })
        .then(function (resultWeather) {

          //Saves results from weather API into appropriate variables
          var currTempIcon = resultWeather.current.weather[0].icon;
          var currTemp = resultWeather.current.temp;
          var currWind = resultWeather.current.wind_speed;
          var currHumid = resultWeather.current.humidity;
          var currUV = resultWeather.current.uvi;

          //Appends content from variables listed above
          $("#currentInfo").addClass("currentInfo");
          $("#currentInfo").css({ "border-width": "1px", "border-style": "solid", "border-color": "rgba(0,0,0,.125)" });
          $("img").css({ "width": "50px", "height": "auto" });
          $("img").attr("src", " https://openweathermap.org/img/wn/" + currTempIcon + "@2x.png")
          $("#currentTemp").append("Temperature: " + currTemp + "??F");
          $("#currentWind").append("Wind: " + currWind + " mph");
          $("#currentHumidity").append("Humidity: " + currHumid + "%");
          $("#uvIndex").append("UV Index: ");
            
            //If statement to check the UV index value and highlights it the appropriate color
            if (currUV <= 3) {
              //Highlight the UV index green -> "success"
              $("#uvIndex").append("<span class='bg-success'>" + currUV + "</span>")
            } else if (currUV <= 6) {
              //Highlight the UV idex yellow -> "warning"
              $("#uvIndex").append("<span class='bg-warning'>" + currUV + "</span>")
            } else {
              //Highlight the UV idex red -> "danger"
              $("#uvIndex").append("<span class='bg-danger'>" + currUV + "</span>")
            };

          $("#fiveDayForecast").append("5 Day Forecast: ")

          //For loop to obtain the five day forecast from the weather API
          for (var i = 0; i < 5; i++) {

            //Creates div container to append content to later
            var divContainer = $("<div class='card divContainer' style='width: 200px; height: auto'></div>")

            //Takes the date and adds 1 to obtain new date. Appends to dynamically created div container
            var futureDate = moment().add(i + 1, 'days').format('L');
            divContainer.append("<h8 class='card-header date'>" + futureDate + "</h8>");

            //Obtains forecast icon from API and appends it to dynamically created div container
            var futureIcon = resultWeather.daily[i].weather[0].icon
            var imgURL = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png"
            divContainer.append("<img src=" + imgURL + " width='50px' height='auto'>");

            //Obtains temperature from API and appends it to dynamically created div container
            var futureTemp = resultWeather.daily[i].temp.day;
            divContainer.append("<p class='card-text forecastContent'> Temperature: " + futureTemp + "??F </p>");

            //Obtains wind speed from API and appends it to dynamically created div container
            var futureWind = resultWeather.daily[i].wind_speed;
            divContainer.append("<p class='card-text forecastContent'> Wind: " + futureWind + " mph </p>");

            //Obtains humidity from API and appends it to dynamically created div container
            var futureHumid = resultWeather.daily[i].humidity;
            divContainer.append("<p class='card-text forecastContent'> Humidity: " + futureHumid + "% </p>");

            //Appends the dynamically created div container to element with id=fiveDayInfo
            $("#fiveDayInfo").append(divContainer);
          }
        })
    });
}


//Clears local storage and recent city buttons when clear button is clicked
$("#clear").click(function () {
  //Clears the recentCitySearch array
  recentCitySearch = [];

  //Clears local Storage
  localStorage.clear();

  //Clears all buttons under cities searched
  $("#citiesSearched").empty();
})


$(document).ready(function () {
  getCitiesSearched();

  $("#submit").click(function () {
    //Calls emptyContent function
    emptyContent();

    //Calls getWeather function
    getWeather();
  });
});
