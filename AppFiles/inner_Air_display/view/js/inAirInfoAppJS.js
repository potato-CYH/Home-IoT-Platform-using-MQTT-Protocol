var socket = io.connect('http://localhost:8081',{
    cors:{origin:'*'}
});
socket.emit('login',"sensorApp" )
socket.on('inAirInfoAppmsg', data => {
    topic = data[0];
    message = data[1];

    if (topic == "home/iotdevice/temp")
    {
        console.log(document.getElementById("Temp"))
        document.getElementById("Temp").innerHTML = (message);
        var a = ((message * 2) + 100) + "px";
        var b = (200 - ((message * 2) + 100)) + 'px';
        document.getElementsByClassName('intemp_meter')[0].style.height = a;
        document.getElementsByClassName('intemp_meter')[0].style.top = b;
    }
    else if (topic == "home/iotdevice/humidity")
    {
        document.getElementById("humidity").innerHTML = (message);
        var c = (190 - (message * 1.9)) +'px'
        document.getElementsByClassName('inhumi_meter')[0].style.height = c;
    }
    else if (topic == "home/iotdevice/dust")
    {
        let msg = message.split(',');
        document.getElementById("pm10").innerHTML = msg[0];
        var pm10_pin_deg = msg[0] / 2;

        if ((msg[0] >= 0) && (msg[0] <= 30))
        {
            $(".pm10_valueClr").css('color', 'rgb(90,174,255)');
            $('.pm10_descriptClr').css('color', 'rgb(90,174,255)');
            $("#PM10_description").html("매우 좋음");

        }
        else if ((msg[0] >= 31) && (msg[0] <= 60))
        {
            $('.pm10_valueClr').css('color', 'rgb(0,165,0)');
            $(".pm10_descriptClr").css('color', 'rgb(0,165,0)');
            $("#PM10_description").html("보통");
        }
        else if ((msg[0] >= 61) && (msg[0] <= 150))
        {
            $('.pm10_valueClr').css('color', 'rgb(255,148,54)');
            $(".pm10_descriptClr").css('color', 'rgb(255,148,54)');
            $("#PM10_description").html("나쁨");
        }
        else if (msg[0] >= 151)
        {
            $('.pm10_valueClr').css('color', 'rgb(255,144,144)');
            $(".pm10_descriptClr").css('color', 'rgb(255,144,144)');
            $("#PM10_description").html("매우 나쁨");
        }
        else
        {
            $('.pm10_valueClr').css('color', 'rgb(255,255,255)');
            $(".pm10_descriptClr").css('color', 'rgb(255,255,255)');
            $("#PM10_description").html("N/A");
            $("#SM/PM10").html("N/A");
        }


        $(".pm10_pinpointer").css('transform', 'rotate(' + pm10_pin_deg + 'deg)');
        if (msg[0] > 330)
        {
            $(".pm10_pinpointer").css('transform', 'rotate(165deg)');
        }

        document.getElementById("pm25").innerHTML = msg[1];
          
    
        var pm25_pin_deg = msg[1] * 2;
    
        
        if ((msg[1] >= 0) && (msg[1] <= 15))
        {
            $(".pm25_valueClr").css('color', 'rgb(90,174,255)');
            $('.pm25_descriptClr').css('color', 'rgb(90,174,255)');
            $("#PM25_description").html("매우 좋음");
        }
        else if ((msg[1] >= 16) && (msg[1] <= 35))
        {
            $('.pm25_valueClr').css('color', 'rgb(0,165,0)');
            $(".pm25_descriptClr").css('color', 'rgb(0,165,0)');
            $("#PM25_description").html("보통");
        }
        else if ((msg[1] >= 36) && (msg[1] <= 75))
        {
            $('.pm25_valueClr').css('color', 'rgb(255,148,54)');
            $(".pm25_descriptClr").css('color', 'rgb(255,148,54)');
            $("#PM25_description").html("나쁨");
        }
        else if (msg[1] >= 76)
        {
            $('.pm25_valueClr').css('color', 'rgb(255,144,144)');
            $(".pm25_descriptClr").css('color', 'rgb(255,144,144)');
            $("#PM25_description").html("매우 나쁨");
        }
        else
        {
            $('.pm25_valueClr').css('color', 'rgb(255,255,255)');
            $(".pm25_descriptClr").css('color', 'rgb(255,255,255)');
            $("#PM25_description").html("N/A");
            $("#SM/PM2").html("N/A");
        }
    
        $(".pm25_pinpointer").css('transform', 'rotate(' + pm25_pin_deg + 'deg)');
        if (msg[1] > 82)
        {
            $(".pm25_pinpointer").css('transform', 'rotate(164deg)');
        }
    }
})