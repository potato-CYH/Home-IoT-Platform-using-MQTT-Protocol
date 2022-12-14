 $(document).ready(function(){
    $("#locationApp").load("/LocationWidget/locationView.html")
});

$(document).ready(function(){
    $("#weatherApp").load("/weatherWidget/weatherAppView.html")
});

$(document).ready(function(){
    $("#inairInfoApp").load("/inner_Air_display/inAirAppView.html")
});

$(document).ready(function(){
    $("#lightControlApp").load("/LightControl/lightCtrlAppView.html")
});

$(document).ready(function(){
    $("#sensorChartApp").load("/indoor_airchart/sensorChart.html")
});
//index.html 화면에 표시할 app의 id와 appview 파일의 경로 지정
