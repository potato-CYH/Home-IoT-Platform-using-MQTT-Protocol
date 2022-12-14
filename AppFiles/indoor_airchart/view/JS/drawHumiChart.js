
let pdata = [];
setInterval(function(){run2();}, 1000*3601);

const chart = new Chart(document.getElementById('humiChart'), {
    type:'line',
    data:{
        labels:[0],
        datasets:[{
            label:'오늘의 실내습도',
            data:[0],
            fill:true,
            backgroundColor:'rgba(200,200,255,0.2)',
            borderColor:'rgb(200,200,255)',
            borderWidth:1,
            tension:0.3
        }]
    },
    options:{
        scales:{
            y: 
                {
                    min:0,
                    max:100
                
                    
                }
            
        }
    }           
   
})
run2();

function run2(){
    $.getJSON('http://localhost:8080/chart/sensor/humi/today', function(data, error){
        for (let i = 0; i < data.length; i++) {
            pdata[i] = { measured_time: ((data[i].measured_time).split(':')[0]).toString() + " 시", value: parseInt(data[i].val) };
        }
        console.log(pdata);
        chart.data.labels=pdata.map(row=> row.measured_time);
        chart.data.datasets[0].data=pdata.map(row => row.value);
        chart.update();
        
    })
}