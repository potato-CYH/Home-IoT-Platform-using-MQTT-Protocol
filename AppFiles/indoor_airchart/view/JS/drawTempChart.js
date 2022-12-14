
let pdata = [];

setInterval(function(){run4();}, 1000*3603);

const chart = new Chart(document.getElementById('tempChart'), {
    type:'line',
    data:{
        labels:[0],
        datasets:[{
            label:'오늘의 실내온도',
            data:[0],
            fill:true,
            backgroundColor:'rgba(255,150,150,0.2)',
            borderColor:'rgb(255,150,150)',
            borderWidth:1,
            tension:0.3
        }]
    },
    options:{
        scales:{
            y:{
                    min:-5,
                    max:50       
            }
    
        }
    }           
   
})
run4();
function run4(){
    $.getJSON('http://localhost:8080/chart/sensor/temp/today', function(data, error){
        for (let i = 0; i < data.length; i++) {
            pdata[i] = { measured_time: ((data[i].measured_time).split(':')[0]).toString() + " 시", value: parseInt(data[i].val) };
        }
        console.log(pdata);
        chart.data.labels = pdata.map(row=> row.measured_time);
        chart.data.datasets[0].data = pdata.map(row => row.value);
        chart.update();
    })
}