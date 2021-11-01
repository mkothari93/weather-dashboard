$("#submit").click(function(){
  
  //Obtains city from user input
  var city = $("#city").val();

  //Appends the city name as a button under the search and clear recent cities button
  $("#searchContentBody").append("<p><button class='btn'>" + city + "</button></p>")

  //API for obtaining longitude and latitude from city provided by user
  fetch("http://api.positionstack.com/v1/forward?query=" + city + "&access_key=4e1af31119a12431a87582be15b02d15")
    .then(function (response) {
    return response.json();
  })
    .then(function (result) {
    
    //Saves the longitude and latitude results from the API response into created variables
    var lon = result.data[0].longitude;
    var lat = result.data[0].latitude;

    //Saves the city and state results from the API response into created variables
    var currCity = result.data[0].name;
    var currState = result.data[0].region_code;

    //Variable created for current date
    var currDate = moment().format('L');

    //Appends city, state, and current date into element with an id=cityName
    $("#cityName").append(currCity + ", " + currState + "  (" + currDate + ")");

    //API for obtaining weather by using the latitude and longitude from variables above
    fetch("http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=66234c6444c4ec62b6a55ecddd9501b0")
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
      $("#currentInfo").css({"border-width": "1px", "border-style": "solid", "border-color": "rgba(0,0,0,.125)"});
      $("img").css({"width": "50px", "height": "auto"});
      $("img").attr("src", " http://openweathermap.org/img/wn/" + currTempIcon + "@2x.png")
      $("#currentTemp").append("Temperature: " + currTemp + "°F");
      $("#currentWind").append("Wind: " + currWind + " mph");
      $("#currentHumidity").append("Humidity: " + currHumid + "%");
      $("#uvIndex").append("UV Index: " + currUV);
      
      $("#fiveDayForecast").append("5 Day Forecast: ")
      
      //For loop to obtain the five day forecast from the weather API
      for (var i = 0; i < 5; i++){

        //Creates div container to append content to later
        var divContainer = $("<div class='card divContainer' style='width: 200px; height: auto'></div>")
        
        //Takes the date and adds 1 to obtain new date. Appends to dynamically created div container
        var futureDate = moment().add(i+1, 'days').format('L');
        divContainer.append("<h8 class='card-header date'>" + futureDate + "</h8>");
        
        //Obtains forecast icon from API and appends it to dynamically created div container
        var futureIcon = resultWeather.daily[i].weather[0].icon
        var imgURL = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png"
        divContainer.append("<img src=" + imgURL + " width='50px' height='auto'>");
        
        //Obtains temperature from API and appends it to dynamically created div container
        var futureTemp = resultWeather.daily[i].temp.day;
        divContainer.append("<p class='card-text forecastContent'> Temperature: " + futureTemp + "°F </p>");

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
});

//Clears local storage when clear button is clicked
$("#clear").click(function (){
  localStorage.clear();
})


  
