
getweather();
setInterval(getweather, 600000); // 10 min update interval

function getweather() {

    $.getJSON('http://localhost:8080/weather/current', function (data, error) {
        //console.log(data)

        var CurrentTemp = data.main.temp;     //현제 온도값 받아오기
        var CurrentWthId = data.weather[0].id;                      //현제 날씨 ID 값(정수형)
        var CurrentWeather = data.weather[0].main;                  //현제 날씨 상태값(문자열)
        var humidity = data.main.humidity;                  //현제 습도 값
        var windspd = data.wind.speed;                 //현제 풍속 값
        var wind_dict = data.wind.deg;                              //현제 풍향 값


        //수신 데이터 가공 및 출력부분
        // 날씨 상태와 아이콘 처리 및 출력
        switch (CurrentWeather) {
            case ("Thunderstorm"):
                CurrentWeather = "비";
                $("#iconimg").attr("src", "/weatherWidget/view/res/Thunderstorm.png");//
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Haze"):
                CurrentWeather = "맑음";
                $("#weatherStates").html(CurrentWeather);
                var time = new Date();
                if ((time.getHours() >= 7) && (time.getHours() <= 18)) {
                    $("#iconimg").attr("src", "/weatherWidget/view/res/clear_day.png");//
                }
                else {
                    $("#iconimg").attr("src", "/weatherWidget/view/res/clear_night.png");//
                }
                break;
            case ("Drizzle"):
                CurrentWeather = "비";
                $("#iconimg").attr("src", "/weatherWidget/view/res/shower_rain.png");//
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Rain"):
                CurrentWeather = "조금비";
                $("#weatherStates").html(CurrentWeather);
                var time = new Date();
                if ((time.getHours() >= 7) && (time.getHours() <= 18)) {
                    $("#iconimg").attr("src", "/weatherWidget/view/res/few_rainy_day.png");//
                }
                else {
                    $("#iconimg").attr("src", "/weatherWidget/view/res/few_rainy_night.png");//
                }
                break;
            case ("Snow"):
                CurrentWeather = "눈";

                $("#iconimg").attr("src", "/weatherWidget/view/res/snow.png");//  
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Mist"):
                CurrentWeather = "안개";
                $("#iconimg").attr("src", "/weatherWidget/view/res/mist.png");//
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Smoke"):
                CurrentWeather = "안개";
                $("#iconimg").attr("src", "/weatherWidget/view/res/mist.png");//
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Dust"):
                CurrentWeather = "안개";
                $("#iconimg").attr("src", "/weatherWidget/view/res/mist.png");//
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Fog"):
                CurrentWeather = "안개";
                $("#iconimg").attr("src", "/weatherWidget/view/res/mist.png");//
                $("#weatherStates").html(CurrentWeather);
                break;
            case ("Clear"):
                CurrentWeather = "맑음";
                $("#weatherStates").html(CurrentWeather);
                var time = new Date();
                if ((time.getHours() >= 7) && (time.getHours() <= 18)) {
                    $("#iconimg").attr("src", "./weatherWidget/view/res/clear_day.png");//
                }
                else {
                    $("#iconimg").attr("src", "/weatherWidget/view/res/clear_night.png");//
                }
                break;
            case ("Clouds"):
                if (CurrentWthId == 801) {
                    CurrentWeather = "구름조금";
                    $("#weatherStates").html(CurrentWeather);
                    var time = new Date();

                    if ((time.getHours() >= 7) && (time.getHours() <= 18)) {

                        $("#iconimg").attr("src", "/weatherWidget/view/res/few_cloud_day.png");//
                    }
                    else {
                        $("#iconimg").attr("src", "/weatherWidget/view/res/few_cloud_night.png");//
                    }
                }
                else if (CurrentWthId == 802) {
                    CurrentWeather = "구름 많음";
                    $("#weatherStates").html(CurrentWeather);
                    var time = new Date();
                    if ((time.getHours() >= 7) && (time.getHours() <= 18)) {
                        $("#iconimg").attr("src", "/weatherWidget/view/res/few_cloud_day.png");//
                    }
                    else {
                        $("#iconimg").attr("src", "/weatherWidget/view/res/few_cloud_night.png");//
                    }

                }
                else if (CurrentWthId == 803) {
                    CurrentWeather = "흐림";
                    $("#weatherStates").html(CurrentWeather);
                    $("#iconimg").attr("src", "/weatherWidget/view/res/cloudy.png");//
                }
                else if (CurrentWthId == 804) {
                    CurrentWeather = "흐림";
                    $("#weatherStates").html(CurrentWeather);
                    $("#iconimg").attr("src", "/weatherWidget/view/res/cloudy.png");//
                }
                else {
                    CurrentWeather = "알 수 없음";
                    $("#weatherStates").html(CurrentWeather);
                    $("#iconimg").attr("src", "/weatherWidget/view/res/unknown.png");

                }
                break;
            default:
                CurrentWeather = "알 수 없음";
                $("#weatherStates").html(CurrentWeather);
                $("#iconimg").attr("src", "/weatherWidget/view/res/Error.png");
                break;
        }

        //현제 풍향 값 데이터 처리 및 출력
        if (wind_dict == 0) {
            wind_dict = "N";
        }
        else if ((wind_dict > 0) && (wind_dict < 90)) {
            wind_dict = "NE";
        }
        else if (wind_dict == 90) {
            wind_dict = "E";
        }
        else if ((wind_dict > 90) && (wind_dict < 180)) {
            wind_dict = "SE";
        }
        else if (wind_dict == 180) {
            wind_dict = "S";
        }
        else if ((wind_dict > 180) && (wind_dict < 270)) {
            wind_dict = "SW";
        }
        else if (wind_dict == 270) {
            wind_dict = "W";
        }
        else if ((wind_dict > 270) && (wind_dict) < 360) {
            wind_dict = "NW";
        }
        else if (wind_dict == 360) {
            wind_dict = "N";
        }
        else {
            wind_dict = "N/A";
        }


        //현제 습도 값 데이터 처리 및 출력
        $("#humidity_property").html(humidity);
        //$("#humidity_icon").attr("src", "/weatherWidget/view/res/humidity_icon.png");

        //현제 풍속 / 풍향 값 데이터 처리 및 출력
        $("#wind_spd").html(windspd);
        //$("#wind_icon").attr("src", "/weatherWidget/view/res/wind.png");
        $("#wind_dict").html(wind_dict);

        //현제 온도 값 데이터 처리 및 출력
        $("#currentTemp").html(CurrentTemp + "°");

    });

    $.getJSON('http://localhost:8080/weather/forecast', function (data, error) {
        console.log(data);
        const tomoWthDay = data.list[5].weather[0].main
        const tomoWthNight = data.list[9].weather[0].main
        const tomoMinTmp = data.list[8].main.temp_min;
        const tomoMaxTmp = data.list[5].main.temp_max;

        const dftomoWthDay = data.list[13].weather[0].main
        const dftomoWthNight = data.list[17].weather[0].main
        const dftomoMinTmp = data.list[16].main.temp_min;
        const dftomoMaxTmp = data.list[13].main.temp_max;

        console.log(tomoWthDay)
        switch (tomoWthDay) {
            case ("Thunderstorm"):
                $("#tomoDay").attr("src", "/weatherWidget/view/res/Thunderstorm.png");//
                break;
            case ("Rain"):
                $("#tomoDay").attr("src", "/weatherWidget/view/res/few_rainy_day.png");//
                break;
            case ("Snow"):
                $("#tomoDay").attr("src", "/weatherWidget/view/res/snow.png");// 
                break;
            case ("Fog"):
                $("#tomoDay").attr("src", "/weatherWidget/view/res/mist.png");//
                break;
            case ("Clear"):
                $("#tomoDay").attr("src", "./weatherWidget/view/res/clear_day.png");//
                break;
            case ("Clouds"):
                $("#tomoDay").attr("src", "/weatherWidget/view/res/few_cloud_day.png");//
                break;
            default:
                $("#tomoDay").attr("src", "/weatherWidget/view/res/cloudy.png");
                break;
        }

        switch (tomoWthNight) {
            case ("Thunderstorm"):
                $("#tomoNight").attr("src", "/weatherWidget/view/res/Thunderstorm.png");//
                break;
            case ("Rain"):
                $("#tomoNight").attr("src", "/weatherWidget/view/res/few_rainy_night.png");//
                break;
            case ("Snow"):
                $("#tomoNight").attr("src", "/weatherWidget/view/res/snow.png");// 
                break;
            case ("Fog"):
                $("#tomoNight").attr("src", "/weatherWidget/view/res/mist.png");//
                break;
            case ("Clear"):
                $("#tomoNight").attr("src", "/weatherWidget/view/res/clear_night.png");//          
                break;
            case ("Clouds"):
                $("#tomoNight").attr("src", "/weatherWidget/view/res/few_cloud_night.png");//    
                break;
            default:
                $("#tomoNight").attr("src", "/weatherWidget/view/res/cloudy.png");
                break;
        }

        switch (dftomoWthDay) {
            case ("Thunderstorm"):
                $("#dftomoDay").attr("src", "/weatherWidget/view/res/Thunderstorm.png");//
                break;
            case ("Rain"):
                $("#dftomoDay").attr("src", "/weatherWidget/view/res/few_rainy_day.png");//
                break;
            case ("Snow"):
                $("#dftomoDay").attr("src", "/weatherWidget/view/res/snow.png");// 
                break;
            case ("Fog"):
                $("#dftomoDay").attr("src", "/weatherWidget/view/res/mist.png");//
                break;
            case ("Clear"):
                $("#dftomoDay").attr("src", "./weatherWidget/view/res/clear_day.png");//
                break;
            case ("Clouds"):
                $("#dftomoDay").attr("src", "/weatherWidget/view/res/few_cloud_day.png");//
                break;
            default:
                $("#dftomoDay").attr("src", "/weatherWidget/view/res/cloudy.png");
                break;
        }

        switch (dftomoWthNight) {
            case ("Thunderstorm"):
                $("#dftomoNight").attr("src", "/weatherWidget/view/res/Thunderstorm.png");//
                break;
            case ("Rain"):
                 $("#dftomoNight").attr("src", "/weatherWidget/view/res/few_rainy_night.png");//
                break;
            case ("Snow"):
                $("#dftomoNight").attr("src", "/weatherWidget/view/res/snow.png");// 
                break;
            case ("Fog"):
                $("#dftomoNight").attr("src", "/weatherWidget/view/res/mist.png");//
                break;
            case ("Clear"):
                 $("#dftomoNight").attr("src", "/weatherWidget/view/res/clear_night.png");//
                break;
            case ("Clouds"):
                 $("#dftomoNight").attr("src", "/weatherWidget/view/res/few_cloud_night.png");//
                break;
            default:
                $("#dftomoNight").attr("src", "/weatherWidget/view/res/cloudy.png");
                break;
        }
        if(tomoMinTmp<tomoMaxTmp){

            $("#tomoMinTemp").html(tomoMinTmp);
            $("#tomoMaxTemp").html(tomoMaxTmp);
            var a = (85/100)*(tomoMaxTmp-tomoMinTmp);
            var b = (-17/10)*tomoMaxTmp+85;
        }
        else if(tomoMinTmp>=tomoMaxTmp){

            $("#tomoMinTemp").html(tomoMaxTmp);
            $("#tomoMaxTemp").html(tomoMinTmp);
            var a = (85/100)*(tomoMinTmp-tomoMaxTmp);
            var b = (-17/10)*tomoMinTmp+85;
        }
        document.getElementsByClassName('forecast-bar')[0].style.height = a*10;
        document.getElementsByClassName('forecast-bar')[0].style.top = b;

        if(dftomoMinTmp<dftomoMaxTmp){

            $("#dftomoMinTemp").html(dftomoMinTmp);
            $("#dftomoMaxTemp").html(dftomoMaxTmp);
            var c = (85/100)*(dftomoMaxTmp-dftomoMinTmp);
            var d = (-17/10)*dftomoMaxTmp+85;

        }
        else if(dftomoMinTmp>=dftomoMaxTmp){
            $("#dftomoMinTemp").html(dftomoMaxTmp);
            $("#dftomoMaxTemp").html(dftomoMinTmp);
            var c = (85/100)*(dftomoMinTmp-dftomoMaxTmp);
            var d = (-17/10)*dftomoMinTmp+85;
        }
        console.log(c, d)
        document.getElementsByClassName('forecast-bar2')[0].style.height = c*10;
        document.getElementsByClassName('forecast-bar2')[0].style.top = d;
    });
}
