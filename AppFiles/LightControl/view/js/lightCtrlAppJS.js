
var socket = io.connect('http://localhost:8081',{
    cors:{origin:'*'}
});
socket.emit('login',"lightApp" )
socket.on('LightControlAppmsg', data => {
    topic = data[0];
    message = data[1];
    console.log(topic);
    console.log(message);

    if (topic == "home/iotdevice/light_res" && message == "11")
    {
        console.log("point")
        $(".lightball_brightness").css('opacity', '1');
        $("#lightball_state").html("ON");
        $(".lightball_state_text").css('color', 'rgb(0,0,0)');
        $(".timer_text_style").css('color', 'rgb(0,0,0)');
        $(".timer_icon").css('opacity', '1');
        
    }
    if (topic == "home/iotdevice/light_res" && message == "10")
    {
        console.log("point")
        $(".lightball_brightness").css('opacity', '0.129');
        $(".timer_icon").css('opacity', '0.2');
        $("#lightball_state").html("");
        $(".lightball_state_text").css('color', 'rgb(200,200,200)');
        $(".timer_text_style").css('color', 'rgb(30,30,30)');
        $("#timer").html('');
    }

});


if (annyang) {
    var speech_recongition_command = {
        '불 켜': function ()
        {
         
            light_controler(0, 0, 0, 1);
        },
        '불 꺼': function ()
        {
            light_controler(0, 0, 0, 0);
        },
        '10초 뒤에 불 꺼': function ()
        {
            light_controler(0, 0, 10, 1);
        },
        '10초 후에 불 꺼': function ()
        {
            light_controler(0, 0, 10, 1);
        },
        '1분 뒤에 불 꺼': function ()
        {
            light_controler(0, 1, 0, 1);
        },
        '1분 후에 불 꺼': function ()
        {
            light_controler(0, 1, 0, 1);
        },
        '1분 30초 뒤에 불 꺼': function ()
        {
            light_controler(0, 1, 30, 1);
        },
        '1분 30초 후에 불 꺼': function ()
        {
            light_controler(0, 1, 30, 1);
        },
        '1시간 뒤에 불 꺼': function ()
        {
            light_controler(1, 0, 0, 1);
        },
        '1시간 후에 불 꺼': function ()
        {
            light_controler(1, 0, 0, 1);
        },
        '3시간 뒤에 불 꺼': function ()
        {
            light_controler(3, 0, 0, 1);
        },
        '3시간 후에 불 꺼': function ()
        {
            light_controler(3, 0, 0, 1);
        },
        
    };

    annyang.addCommands(speech_recongition_command);
    annyang.debug();
    annyang.setLanguage('ko');
    annyang.start({ autoRestart: true, continous: true });
    annyang.resume();
}
    

function light_controler(timer_hh_value_input, timer_mm_value_input, timer_sec_value, on_off_input)      //필요시 인자 추가 가능
{
    $("#timer_text").html("타이머");
    if (on_off_input == 0)
    {
        clearInterval(timer_process);
        // 전구 제어용으로 MQTT서버에 "0" 값을 보내는 함수 사용위치

        socket.emit('LightControlAppmsg', '0'); // 전구 OFF 메시지 발송    
        
    }
    
    if (on_off_input == 1)
    {
        socket.emit('LightControlAppmsg', '1'); // 전구 ON 메시지 발송
        
        //전구 타이머를 별도로 설정하지 않았을 경우 처리
        if ((timer_hh_value_input == 0) && (timer_mm_value_input == 0) && (timer_sec_value == (0)))
        {
            clearInterval(timer_process);
            $("#timer").html("");
        }
        else
        //전구 타이머를 설정하였을 시 처리
        {
            //타이머 설정 정보 displaying
            //시간 표시 제어
               
            var timer_process = setInterval(function ()
            {
                if (timer_hh_value_input == 0)
                {
                    $("#timer").html(timer_mm_value_input + "분 " + timer_sec_value + "초");
                    if ((timer_mm_value_input == 0))
                    {
                        $("#timer").html(timer_sec_value + "초");
                    }
                }
                else if ((timer_hh_value_input != 0) || (timer_mm_value_input != 0) || (timer_sec_value != 0))
                {
                    $("#timer").html(timer_hh_value_input + "시간 " + timer_mm_value_input + "분 " + timer_sec_value + "초");
                }
                //타이머 종료시 프로세스
                if ((timer_hh_value_input == 0) && (timer_mm_value_input == 0) && (timer_sec_value == 0))
                {
                    clearInterval(timer_process);

                    socket.emit('LightControlAppmsg', '0'); // 전구 OFF 메시지 발송

                }
                else
               //타이머 연산
                {
                    timer_sec_value--;
                    if (timer_sec_value < 0)
                    {
                        timer_mm_value_input--;
                        timer_sec_value = 59;
                    }

                    if (timer_mm_value_input < 0)
                    {
                        if (timer_hh_value_input > 0)
                        {
                            timer_hh_value_input--;
                            timer_mm_value_input = 59;
                        }

                    }
                }
            }, 1000);
            
        }
         //clearInterval(timer_process);

    }    

}

