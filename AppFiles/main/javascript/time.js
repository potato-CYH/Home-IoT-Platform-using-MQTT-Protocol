   
clock();

function clock() {
    //요일 정수값에 대응하는 문자 변환값 배열 선언
    var day = new Array('일', '월', '화', '수', '목', '금', '토');

    //한 자리수의 경우 0을 붙이기 위한 함수 addZeros() 사용
    var time = new Date();          //시스템 시간 객체 가져오기
    var am_pm = 'AM';           //AM / PM 변수 - 초기값 AM
    var currentHours = addZeros(time.getHours(), 0);      //현제 시  
    var currentMinute = addZeros(time.getMinutes(), 2);     //현제 분
    var currentSec = addZeros(time.getSeconds(), 2);        //현제 초(디버깅 및 분석시에 활성화)
    var currentDates = addZeros(time.getDate(), 0);     //현제 요일
    var currentMonths = addZeros(time.getMonth()+1, 0);     //현제 월
    var currentYears = time.getFullYear();          //현제 년도(디버깅 및 분석시에 활성화)
    var currentDays = day[time.getDay()];       //현제 요일

    //AM - PM 변경 처리
    if (currentHours == '0') {
        currentHours = addZeros(time.getHours(), 2);
    }

    if ((currentHours >= 12) && (currentHours <= 13)) {
        am_pm = 'PM';
    }

    if ((currentHours >= 13) && (currentHours <= 24)) {
        am_pm = 'PM';
        currentHours = addZeros(currentHours - 12, 0);
    }

    //현제 시각 출력
    $("#clock_Date").html(currentMonths + "월 " + currentDates + "일 " + currentDays + "요일");
    $("#clock_time").html(currentHours + ":" + currentMinute);
    $("#am_pm").html(am_pm);

    //갱신 간격 : 1sec
     setTimeout("clock()", 1000);
    
    }

    //한 자리 숫자인 경우 0을 추가해주는 함수
    function addZeros(num, digit)
    {                     //two number sorting
        var zero = '';
        num = num.toString();
        if (num.length < digit) {
            for (i = 0; i < digit - num.length; i++) {
                zero += '0';
            }
         }
        return zero + num;
    }