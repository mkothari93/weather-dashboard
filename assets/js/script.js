$("#submit").click(function(){
  var city = $("#city").val();

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

    $("#cityName").append(currCity + ", " + currState);
  
  fetch("http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=66234c6444c4ec62b6a55ecddd9501b0")
    .then(function (responseWeather) {
    return responseWeather.json();
  })
    .then(function (resultWeather) {
    console.log(resultWeather);
    
    var currTemp = resultWeather.current.temp;
    var currTempIcon = resultWeather.current.weather[0].icon;
    var currWind = resultWeather.current.wind_speed;
    var currHumid = resultWeather.current.humidity;
    var currUV = resultWeather.current.uvi;

    $("#currentTemp").append("Temperature: " + currTemp + "°F");
    $("img").css({"width": "50px", "height": "auto", "border": "1px solid black"});
    $("img").attr("src", " http://openweathermap.org/img/wn/" + currTempIcon + "@2x.png")
    $("#currentWind").append("Wind: " + currWind + " mph");
    $("#currentHumidity").append("Humidity: " + currHumid + "%");
    $("#uvIndex").append("UV Index: " + currUV);

    for (var i = 0; i < 5; i++){  
      var futureTemp = resultWeather.daily[i].temp.day;
      $("#futureTemp").append("Temperature: " + futureTemp + "°F");

      var futureWind = resultWeather.daily[i].wind_speed;
      $("#futureWind").append("Wind: " + futureWind + " mph");
      
      var futureHumid = resultWeather.daily[i].humidity;
      $("#futureHumidity").append("Humidity: " + futureHumid + "%");
    }
  })
});
});



  
