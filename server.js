const fs = require('fs');
const request = require('request');
const express = require('express');
const mysql = require('mysql');
const mqtt = require('mqtt');
var appServer = express();

const socketApp = express();
const socketServer = require('http').createServer(socketApp);
const io = require('socket.io')(socketServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const config = require('./config');
const sysData = require('./received_data/system_geocoord.json');

function getNowDate() {
    let today = new Date();

    let yyyy = today.getFullYear();
    let mm = ('0' + (today.getMonth() + 1)).slice(-2);
    let dd = ('0' + today.getDate()).slice(-2);
    
    let hh = ('0' + today.getHours()).slice(-2);
    let m = ('0' + today.getMinutes()).slice(-2);
    let ss = ('0' + today.getSeconds()).slice(-2);
    
    let result = [`${yyyy}-${mm}-${dd}`, `${hh}:${m}:${ss}`]
    return result;
}

//mysql DB 연결 정보 설정
var mysqlClient = mysql.createConnection({
    host: config.MYSQL_CONFIG.host,
    user: config.MYSQL_CONFIG.user,
    password: config.MYSQL_CONFIG.pw,
    database: config.MYSQL_CONFIG.dburl
});
//MQTT 연결 정보 설정
const mqttClient = mqtt.connect({
    host: config.MQTT_CONFIG.host,
    port: config.MQTT_CONFIG.port,
    //protocol : config.MQTT_CONFIG.protocol,
    //username : config.MQTT_CONFIG.user,
    //password : config.MQTT_CONFIG.pw
});
//MQTT 가동
mqttClient.on('connect', function () {
    console.log("---------------------------------------------")
    console.log(`mqtt client : ${mqttClient.connected}`)
    console.log("status : Connected")
    console.log("---------------------------------------------")
})
mqttClient.on('error', function (err) {
    console.log(`MQTT Connection Error : ${err}`);
    process.exit(1)
});

//MQTT Topic Subscribe
/** 이 부분에 App 들이 subscribe할 topic 을 추가 **/
mqttClient.subscribe("home/iotdevice/temp", { qos: 0 }, () => {
    console.log("<Topic> [home/iotdevice/temp] is subscribed\n");
});

mqttClient.subscribe("home/iotdevice/dust", { qos: 0 }, () => {
    console.log("<Topic> [home/iotdevice/dust] is subscribed\n");
});

mqttClient.subscribe("home/iotdevice/humidity", { qos: 0 }, () => {
    console.log("<Topic> [home/iotdevice/humidity] is subscribed\n");
});
mqttClient.subscribe("home/iotdevice/light_res", { qos: 2 }, () => {
    console.log("<Topic> [home/iotdevice/light_res] is subscribed\n")
});
/* 
mqtt_client.subscribe(Topic_Str,{qos:value}, () => {
    callback function body
});
*/


/***** 사용자가 추가할 위젯에 자주 사용될 기본 데이터들을 미리 받아서 갱신한다.  *****/
//Geo Coord
setInterval(function () {
    console.log("지오코드");
    const options = {
        url: `https://www.googleapis.com/geolocation/v1/geolocate?key=${config.GEO_COORD_CONFIG.apiKey}`,
        method: 'POST'
    }
    request.post(options, function (err, response, body) {
        try {
            console.log(response.statusCode)
            const data = JSON.parse(body)
            //console.log(data);
            fs.writeFile('./received_data/system_geocoord.json', JSON.stringify(data), function (err) {
                try {
                    console.log('./received_data/system_geocoord.json => updated');
                }
                catch (exception) {
                    console.log(err);
                }
            });
        }
        catch (exception) {
            console.log(err);
        }
    })
}, 1000 * 3600 * 12);

/***** 위젯이 사용하는 Open API 수신 데이터를 로컬에 저장하는 부분 *****/
//날씨 위젯
setInterval(function () {
    //현재날씨
    const current_wth_url = `https://api.openweathermap.org/data/2.5/weather?lat=${config.WTH_API_CONFIG.lat}&lon=${config.WTH_API_CONFIG.lon}&lang=${config.WTH_API_CONFIG.lang}&units=${config.WTH_API_CONFIG.units}&appid=${config.WTH_API_CONFIG.apiKey}`;
    //console.log(current_wth_url)
    request.get(current_wth_url, function (err, response, body) {
        try {
            console.log(response.statusCode)
    
            const data = JSON.parse(body)
            //console.log(data);
            fs.writeFile('./received_data/current_wth.json', JSON.stringify(data), function (err) {
                try {
                    console.log('./received_data/current_wth.json => updated');
                }
                catch (exception) {
                    console.log(err);
                }
            });
        }
        catch (exception) {
            console.log(err);
        }
    })
}, 1000 * 3610);

setInterval(function () {
    //5일치 예보
    const wth_forecast_url = `https://api.openweathermap.org/data/2.5/forecast?lat=${config.WTH_API_CONFIG.lat}&lon=${config.WTH_API_CONFIG.lon}&lang=${config.WTH_API_CONFIG.lang}&units=${config.WTH_API_CONFIG.units}&cnt=${config.WTH_API_CONFIG.cnt}&appid=${config.WTH_API_CONFIG.apiKey}`;
    // console.log(wth_forecast_url)
    request.get(wth_forecast_url, function (err, response, body) {
        try {
            console.log(response.statusCode)
            const data = JSON.parse(body)
            //console.log(data);
            fs.writeFile('./received_data/forecast_wth.json', JSON.stringify(data), function (err) {
                try {
                    console.log('./received_data/forecast_wth.json => updated');
                }
                catch (exception) {
                    console.log(err);
                }
            });
        }
        catch (exception) {
            console.log(err);
        }
    })
}, 3600*1000);

//위치 위젯
setInterval(function () {
    const options = {
        url: `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${sysData.location.lng}&y=${sysData.location.lat}`,
        headers: {
            'Authorization': `KakaoAK ${config.REGION_INFO_CONFIG.apiKey}`
        }
    }
    request.get(options, function (err, response, body) {
        try {
            console.log(response.statusCode)
            const data = JSON.parse(body)
            //console.log(data);
            fs.writeFile('./received_data/region_data.json', JSON.stringify(data), function (err) {
                try {
                    console.log('./received_data/region_data.json => updated');
                }
                catch (exception) {
                    console.log(err);
                }
            });
        }
        catch (exception) {
            console.log(err);
        }
    })
}, 1000 *3600 * 12);



/*** Server ****/ 
appServer.listen(8080, () => {
    console.log("server 8080 started\n");

})
appServer.use(express.static('AppFiles'));
appServer.use(express.json());
appServer.use(express.urlencoded());

//메인페이지
appServer.get('/', function (request, response) {
    console.log("GET : /localhost:8080\n");
    response.sendFile(__dirname + '/AppFiles/index.html');
});

/***** 클라이언트의 위젯이 서버로부터 받아올 데이터를 조회하기 위한 API 구현 *****/
//위치 위젯
appServer.get('/location', function (req, res) {
    fs.readFile('./received_data/region_data.json', 'utf8', function (err, data) {
        try {
            res.send(JSON.parse(data));
        } catch (exception) {
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
});

//날씨 위젯(현재날씨)
appServer.get('/weather/current', function (req, res) {
    fs.readFile('./received_data/current_wth.json', 'utf8', function (err, data) {
        try {
            res.send(JSON.parse(data));
        } catch (exception) {
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
})
//날씨 위젯(5일치 예보)
appServer.get('/weather/forecast', function (req, res) {
    fs.readFile('./received_data/forecast_wth.json', 'utf8', function (err, data) {
        try {
            res.send(JSON.parse(data));
        } catch (exception) {
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
})
//센서별로 오늘 시간별 평균 측정값 
//온도
appServer.get('/chart/sensor/temp/today', function(req, res){
    mysqlClient.query(`select measured_time, avg(temp_value) as val from temperature_data where measured_date = '${getNowDate()[0]}' group by hour(measured_time)`, function(err, data){
        try{
            res.send(data)
        }catch(exception){
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
})
//미세먼지
appServer.get('/chart/sensor/dust/today', function(req, res){
    mysqlClient.query(`select measured_time, avg(pm10_value) as pm10, avg(pm25_value) as pm25 from dust_data where measured_date = '${getNowDate()[0]}' group by hour(measured_time)`, function(err, data){
        try{
            res.send(data)
        }catch(exception){
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
})
//습도
appServer.get('/chart/sensor/humi/today', function(req, res){
    mysqlClient.query(`select measured_time, avg(humi_value) as val from humidity_data where measured_date = '${getNowDate()[0]}' group by hour(measured_time)`, function(err, data){
        try{
            res.send(data)
        }catch(exception){
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
})
//전등
appServer.get('/chart/sensor/light/today', function(req, res){
    mysqlClient.query(`select on_off_signal, count(on_off_signal) as cnt from light_control where measured_date = '${getNowDate()[0]}' group by on_off_signal`, function(err, data){
        try{
            res.send(data)
        }catch(exception){
            res.send(JSON.parse(`{"data":${err}}`));
        }
    })
})



//웹소켓 서버 연동
const PORT = 8081;
let socketId = {};
socketServer.listen(PORT, () => {
    console.log(`WebSocket at ${PORT} started\n`);
})

io.on('connection', function (socket) {
    //웹소켓을 사용하는 App은 소켓 서버에 App별 "socket : 설정한 고유 id" 매핑 테이블 생성
    socket.on('login', function(data){
        socketId[data] = socket
        console.log("---------------------------------------------")
        console.log(`${data} : ${socket}`)
        console.log("status : Connected")
        console.log("---------------------------------------------")
    })



    mqttClient.on('message',  function (topic, message) {
        //MQTT를 Subscribe 하여 클라이언트로 보내는 기능을 가진
        //위젯(App) 이 추가되면, if{...} 블록으로 수행할 기능을 작성하여 추가시킨다.
        
        //온습도, 미세먼지 센서 App
        if(socket == socketId["sensorApp"]){        //서버에 연결된 위젯(App) 의 소켓이 여러개이므로, 개별 소켓에 대한 처리가 필요하므로 조건문 사용
            
            socket.emit('inAirInfoAppmsg', [topic.toString(), message.toString()]);     //subscribe한 데이터를 클라이언트로 emit
            //topic 별로 필터링하여 DB에 저장
            if (topic == "home/iotdevice/temp") {
                mysqlClient.query(`INSERT INTO temperature_data (temp_value, measured_date, measured_time) VALUES(${message.toString()}, '${getNowDate()[0]}', '${getNowDate()[1]}')`, function(err, res){
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`Temperature Sensor Data => DB 'insert' success.`)
                    } 
                })
                
            }
            else if (topic == "home/iotdevice/humidity") {
                mysqlClient.query(`INSERT INTO humidity_data (humi_value, measured_date, measured_time) VALUES(${message.toString()}, '${getNowDate()[0]}', '${getNowDate()[1]}')`, function(err, res){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Humidity Sensor Data => DB 'insert' success.")
                    } 
                })
            }
            else if (topic == "home/iotdevice/dust") {
                let msg = (message.toString()).split(',');
                mysqlClient.query(`INSERT INTO dust_data (pm10_value,pm25_value, measured_date, measured_time) VALUES(${msg[0]}, ${msg[1]}, '${getNowDate()[0]}','${getNowDate()[1]}')`, function(err, res){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("Dust Sensor Data => DB 'insert' success.")
                    } 
                })
            }
        }
        //전등 제어 App
        if(socket == socketId["lightApp"]){
            socket.emit('LightControlAppmsg', [topic.toString(), message.toString()]);          //subscribe한 데이터를 클라이언트로 emit
            if(topic == "home/iotdevice/light_res"){
                mysqlClient.query(`INSERT INTO light_control (on_off_signal, measured_date, measured_time) VALUES(${message.toString()}, '${getNowDate()[0]}', '${getNowDate()[1]}')`, function(err, res){
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`light Control Signal Data (${message.toString()}) => DB 'insert' success.`)
                    } 
                })
            }
        }
        //이하 Custon App 별 코드 추가

        /* MQTT subscribe 하는 App 이 추가될 경우, 해당 기능을 하는 코드를
         * 이하에 if{....} 블록으로 추가한다. */

        /*

        //Custom App1
        if(socket == socketId["client id"]){
            // 원하는 코드 추가
        }
        //Custom App2
        if(socket == socketId["client id"]){
            // 원하는 코드 추가
        }

        */
    })
   


    //MQTT를 Publish 하는 기능을 가진
    //위젯(App) 이 추가되면, socket.on(...) 으로 수행할 기능을 작성하여 추가시킨다.

    //전등 제어 App
    socket.on('LightControlAppmsg', function (data) {
        console.log('LightControlAppmsg' + data);
        //publish
        mqttClient.publish("home/iotdevice/light", data, { qos: 2 }, function () {
            //작동 완료 후 응답메세지 subscribe
            console.log(`publish ${data} Okay`)
        });
    })
    /* MQTT publish 하는 App추가 시, 이 부분에 App 별 기능 추가
    /*

    //Custom App1
    socket.on('event', callback)

    //Custom App2
    socket.on('event', callback)
    .
    .

    */
})

