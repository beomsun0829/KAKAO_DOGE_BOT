
    const request = require('request');
    let URL = "https://binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    const options = {
        url: URL,
        type:"get",
    };

    request.get(options,function(err,data){
        if(err){
            console.log(err)
        }
        else{
            let chart_data = data.body;
            let object_data = JSON.parse(chart_data);
            let data_set = object_data;
            console.log(chart_data);
        }
    })
    
