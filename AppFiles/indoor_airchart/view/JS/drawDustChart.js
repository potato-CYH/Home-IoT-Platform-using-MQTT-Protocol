
let pdata = [];
setInterval(function(){run1();}, 1000*3600);

const chart = new Chart(document.getElementById('dustChart'), {
    data:{
        labels:[0],
        datasets:[{
            type:'line',
            label:'오늘의 실내 미세먼지 농도',
            data:[0],
            fill:true,
            
            borderColor:'rgb(150,255,150)',
            borderWidth:1,
            tension:0.3
        },
        {
            type:'line',
            label:'오늘의 실내 초미세먼지 농도',
            data:[0],
            fill:true,
   
            borderColor:'rgb(255,200,150)',
            borderWidth:1,
            tension:0.3
        }]
    },
    options:{
        scales:{
            y: 
            {
                    min:0,
                   
                
                    
                }
            
            }
        }         
   
})
run1();
function run1(){
    $.getJSON('http://localhost:8080/chart/sensor/dust/today', function(data, error){
        for (let i = 0; i < data.length; i++) {
            pdata[i] = { measured_time: ((data[i].measured_time).split(':')[0]).toString() + " 시", pm10: parseInt(data[i].pm10), pm2:parseInt(data[i].pm25) };
        }
        console.log(pdata);
        
        chart.data.labels=pdata.map(row=>row.measured_time)
        chart.data.datasets[0].data=pdata.map(row=>row.pm10)
        chart.data.datasets[1].data=pdata.map(row=>row.pm2)
        chart.update();
    })
    
}