$("#submit").click(function(){
  var city = $("#city").val();

  $("#searchContentBody").append("<p><button class='btn'>" + city + "</button></p>")

  fetch("http://api.positionstack.com/v1/forward?query=" + city + "&access_key=4e1af31119a12431a87582be15b02d15")
    .then(function (response) {
    return response.json();
  })
    .then(function (result) {
    //console.log(result);
    var lon = result.data[0].longitude;
    var lat = result.data[0].latitude;
    var currCity = result.data[0].name;
    var currState = result.data[0].region_code;
    var currDate = moment().format('L')

    $("#cityName").append(currCity + ", " + currState + "  (" + currDate + ")");

  
  fetch("http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=66234c6444c4ec62b6a55ecddd9501b0")
    .then(function (responseWeather) {
    return responseWeather.json();
  })
    .then(function (resultWeather) {
    console.log(resultWeather);

    var currTempIcon = resultWeather.current.weather[0].icon;
    var currTemp = resultWeather.current.temp;
    var currWind = resultWeather.current.wind_speed;
    var currHumid = resultWeather.current.humidity;
    var currUV = resultWeather.current.uvi;

    $("#currentInfo").css({"border-width": "1px", "border-style": "solid", "border-color": "rgba(0,0,0,.125)"});
    $("img").css({"width": "50px", "height": "auto"});
    $("img").attr("src", " http://openweathermap.org/img/wn/" + currTempIcon + "@2x.png")
    $("#currentTemp").append("Temperature: " + currTemp + "°F");
    $("#currentWind").append("Wind: " + currWind + " mph");
    $("#currentHumidity").append("Humidity: " + currHumid + "%");
    $("#uvIndex").append("UV Index: " + currUV);
    
    $("#fiveDayForecast").append("5 Day Forecast: ")

    for (var i = 0; i < 5; i++){
        var divContainer = $("<div class='card divContainer' style='width: 200px; height: auto'></div>")
      
        var futureDate = moment().add(i+1, 'days').format('L');
        divContainer.append("<h8 class='card-header date'>" + futureDate + "</h8>")
        
        var futureIcon = resultWeather.daily[i].weather[0].icon
        var imgURL = "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png"
        divContainer.append("<img src=" + imgURL + " width='50px' height='auto'>");
         
        var futureTemp = resultWeather.daily[i].temp.day;
        divContainer.append("<p class='card-text forecastContent'> Temperature: " + futureTemp + "°F </p>");

        var futureWind = resultWeather.daily[i].wind_speed;
        divContainer.append("<p class='card-text forecastContent'> Wind: " + futureWind + " mph </p>");
        
        var futureHumid = resultWeather.daily[i].humidity;
        divContainer.append("<p class='card-text forecastContent'> Humidity: " + futureHumid + "% </p>");

        $("#fiveDayInfo").append(divContainer);
    }
  })
});
});

$("#clear").click(function (){
  localStorage.clear();
})


  
