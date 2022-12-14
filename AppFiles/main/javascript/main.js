$("#page1").show();
$("#page2").hide();

if (annyang) {
    var speech_recongition_command = {
        '차트 실행 해줘': function ()
        {
         
            $("#page1").hide();
            $("#page2").show();

        },
        '돌아가줘': function ()
        {
            $("#page1").show();
            $("#page2").hide();
        },
        
        
    };

    annyang.addCommands(speech_recongition_command);
    annyang.debug();
    annyang.setLanguage('ko');
    annyang.start({ autoRestart: true, continous: true });
    annyang.resume();
}