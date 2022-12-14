getlocation();
setInterval(getlocation, 1000*100); // 6h update interval

function getlocation()
{
    $.getJSON('http://localhost:8080/location', function(data){
        //console.log(data.documents[0])
        
        const value = data.documents[0];
        const city = value.region_1depth_name;
        const district = value.region_2depth_name;
        const village = value.region_3depth_name;
        const locStr =city +" "+district+" "+village;

        $('#location').html(locStr);
        
    });
}
