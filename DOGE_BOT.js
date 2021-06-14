

/*   선언   */
let doge_bot_ver = "1.4";
let output_text = "";

let now;
let Nearest_Funding_Time;
let now_Hour;
let Nearest_Funding_left_hour;
let Nearest_Funding_left_mins;
let Nearest_Funding_left_secs;
let Run_time = new Date();

let dict_nat = {};
let dict_cmd = {};
let dict_inc = {};
let str_split_Arr = {};

let info_msg_sender;
let batt_health;
let batt_status;

let splited_msg;
let splited_data;
let papago_Api_Tr_result;

let dust_raw_data;
let big_dust_data;
let small_dust_data;
let ozone_data;

let same_alarm = new Array(100);
for(let i = 0; i < same_alarm; i++){
    same_alarm[i] = "";
}
let same_alarm_idx = 0;



/*   선언 종료   */

/*   사전초기화   */
dict_init(dict_nat, dict_cmd, dict_inc);


/*   메인함수   */
function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    
    replier.markAsRead();

    try{

        /*   초기화 섹션   */
        initialize();
        
        
        /*   메세지 자르기   */
        
        str_split_Arr = [];
        splited_msg = msg.split(" ");
        splited_data = msg.replace(splited_msg[0] + " ","");
        str_split_Arr = msg.split(" ");


        
        /*   단순 명령어   */

        
        /*   테스터   */


        
        if(dict_cmd[msg] == "/test"){
            
            //let timerid = setInterval(() => Api.replyRoom("홍범순", "1", "com.kakao.talk"),1000);
        }



        /*   봇 정보   */
        if(dict_cmd[msg] == "/info"){               
            info_msg_sender = "";
            batt_health = "";
            batt_status = "";
            info_msg_sender += "DOGE_BOT " + doge_bot_ver + " LIVE\n\n";
            info_msg_sender += "마지막 컴파일 : ";
            info_msg_sender += Run_time.toLocaleString() + "\n\n";
            info_msg_sender += Device.getBuild();
            info_msg_sender += "\nAndroid_Ver : " + Utils.getAndroidVersionCode() + ", " + Utils.getAndroidVersionName() + "OS : \n";
            info_msg_sender += (Utils.getPhoneBrand() + "  " + Utils.getPhoneModel() + "\n\n").toUpperCase();

            if(Device.isCharging()){
                info_msg_sender += "충전중  ";
            }
            else{
                info_msg_sender += "전원사용중  ";
            }
            info_msg_sender += Device.getBatteryLevel() + "%  " + Device.getBatteryVoltage() + "mV\n";
            info_msg_sender += "현재 온도 : " + Device.getBatteryTemperature()/10 + "\n";

            batt_health = ["BATTERY_STATUS_CHARGING",
                            "BATTERY_STATUS_DISCHARGING",
                            "BATTERY_STATUS_FULL",
                            "BATTERY_STATUS_NOT_CHARGING",
                            "BATTERY_STATUS_UNKNOWN"];

            batt_status = ["BATTERY_HEALTH_COLD",
                            "BATTERY_HEALTH_DEAD",
                            "BATTERY_HEALTH_GOOD",
                            "BATTERY_HEALTH_OVERHEAT",
                            "BATTERY_HEALTH_OVER_VOLTAGE",
                            "BATTERY_HEALTH_UNKNOWN",
                            "BATTERY_HEALTH_UNSPECIFIED_FAILURE"];

            info_msg_sender += batt_status[Device.getBatteryStatus()] + "\n";
            info_msg_sender += batt_health[Device.getBatteryHealth()] + "\n\n";

            info_msg_sender += "WIFI STATUS : " + Api.getContext().getSystemService(android.content.Context.WIFI_SERVICE).getConnectionInfo();

            replier.reply(info_msg_sender);
        }


        /*   명령어 목록   */
        if(dict_cmd[msg] == "/help"){                 

            let cmd_list_str = "명령어 목록 \n";
            for(prop in dict_cmd){
                cmd_list_str += "\n" + prop + " : " + dict_cmd[prop] ;
            }

            cmd_list_str += "\n\n자연어 목록\n";
            for(prop in dict_nat){
                cmd_list_str +=  "\n" + prop + " : " + dict_nat[prop];
            }

            
            cmd_list_str += "\n\n포함된 자연어 목록\n";
            for(prop in dict_inc){
                cmd_list_str +=  "\n" + prop + " : " + dict_inc[prop];
            }

            replier.reply(
                "DOGE_BOT " + doge_bot_ver + " LIVE\n\n" + 
                cmd_list_str
            );
        }


        /*   현재시간   */
        if(dict_cmd[msg] == "/time"){                 
            now = new Date();
            replier.reply("현재시간 : " + now.toLocaleString() + " KST");
        }


        /*   남은 전역일   */
        if(dict_cmd[msg] == "/전역"){                 
            let sdt = new Date();
            let edt = new Date("2022-05-22");

            output_text = "전역까지 ";
            let msec = edt.getTime() - sdt.getTime();
            output_text += Math.ceil(msec/1000/60/60/24) + "일 남았습니다\n";

            /*
            output_text += Math.ceil(msec/1000/60/60/24) + "일 ㅋㅋ 이걸 시간으로하면 ";
            output_text += Math.ceil(msec/1000/60/60) + "시간 ㅋㅋ 이걸 분으로하면";
            output_text += Math.ceil(msec/1000/60) + "분 ㅋㅋ 이걸 초로하면";
            output_text += Math.ceil(msec/1000) + "초남음 ㅋㅋㅅㅂ";
            */
            replier.reply(output_text);
        }

        
        /*   날씨   */
        if (dict_cmd[msg] == "/전국날씨") {
            let weather_data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨").get();
            weather_data = weather_data.select("div.lcl_lst").get(0);
            weather_data = weather_data.select("a");
            let weather_output_text = [];
            for (let n = 0; n < weather_data.size(); n++) {
                weather_output_text[n] = weather_data.get(n).text();
            }     
            replier.reply("[전국 날씨 정보]\n\n" + weather_output_text.join("\n").replace(/도씨/g, "℃"));
        }


        /*   펀비   */
        if(dict_cmd[msg] == "/펀비"){
            now = new Date();
            now_Hour = now.getHours();

            if(now_Hour >= 01 && now_Hour < 09){
                Nearest_Funding_Time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
            }

            else if(now_Hour >= 09 && now_Hour < 17){
                Nearest_Funding_Time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
            }

            else{
                Nearest_Funding_Time = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0, 0);
            }

            Nearest_Funding_left_secs = Nearest_Funding_Time.getSeconds() - now.getSeconds();
            Nearest_Funding_left_mins = Nearest_Funding_Time.getMinutes() - now.getMinutes();
            Nearest_Funding_left_hour = Nearest_Funding_Time.getHours() - now.getHours();

            if(Nearest_Funding_left_secs < 0){
                Nearest_Funding_left_secs = Nearest_Funding_left_secs + 60;
                Nearest_Funding_left_mins = Nearest_Funding_left_mins - 1;
            }

            if(Nearest_Funding_left_mins < 0){
                Nearest_Funding_left_mins = Nearest_Funding_left_mins + 60;
                Nearest_Funding_left_hour = Nearest_Funding_left_hour - 1;
            }

            if(Nearest_Funding_left_hour < 0){
                Nearest_Funding_left_hour = Nearest_Funding_left_hour + 24;
            }

            output_text += "Next Funding : " + Nearest_Funding_Time.toTimeString() + "\n";
            output_text += Nearest_Funding_left_hour + "시간 " + Nearest_Funding_left_mins + "분 " + Nearest_Funding_left_secs + "초 남았습니다\n\n";
            
            
            let premiumIndex_raw = org.jsoup.Jsoup.connect("https://www.binance.com/fapi/v1/premiumIndex").ignoreContentType(true).get().text();
            let premiumIndex_json = JSON.parse(premiumIndex_raw);

            output_text += "[Funding Rate]\n";
            for(let i=0;i<premiumIndex_json.length;i++){
                output_text +=  premiumIndex_json[i].symbol + " : " + premiumIndex_json[i].lastFundingRate + "\n";
            }
            
            
            replier.reply(output_text);

        }


        /*   봇 컴파일   */
        if(dict_cmd[msg] == "/compile"){
            replier.reply(recompile_bot_func());
        }

        /*   코로나   */
        if(dict_cmd[msg] == "/코로나"){
            let corona_data = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?query=코로나").get();
            let status_corona_data = corona_data.select("div.status_info");
            let status_corona_data_01 = status_corona_data.select("li.info_01").select("p.info_num").get(0).text();
            let status_corona_data_01_var = status_corona_data.select("li.info_01").select("em.info_variation").get(0).text();
            let status_corona_data_02 = status_corona_data.select("li.info_02").select("p.info_num").get(0).text();
            let status_corona_data_02_var = status_corona_data.select("li.info_02").select("em.info_variation").get(0).text();
            let status_corona_data_03 = status_corona_data.select("li.info_03").select("p.info_num").get(0).text();
            let status_corona_data_03_var = status_corona_data.select("li.info_03").select("em.info_variation").get(0).text();
            let status_corona_data_04 = status_corona_data.select("li.info_04").select("p.info_num").get(0).text();
            let status_corona_data_04_var = status_corona_data.select("li.info_04").select("em.info_variation").get(0).text();

            output_text += "확진환자 : " + status_corona_data_01 + " (+" + status_corona_data_01_var + ")" + "\n";
            output_text += "격리해제 : " + status_corona_data_02 + " (+" + status_corona_data_02_var + ")" + "\n";
            output_text += "사망자 : " + status_corona_data_03 + " (+" + status_corona_data_03_var + ")" + "\n";
            output_text += "검사진행 : " + status_corona_data_04 + " (+" + status_corona_data_04_var + ")" + "\n\n";
            
            let today_corona_data = corona_data.select("div.status_today").get(0);
            let today_corona_data_01 = today_corona_data.select("li.info_02").select("em.info_num").get(0).text();
            let today_corona_data_02 = today_corona_data.select("li.info_03").select("em.info_num").get(0).text();

            output_text += "일일 확진자 수 : " + (parseInt(today_corona_data_01) + parseInt(today_corona_data_02)) + "\n";
            output_text += "국내 발생 : " + today_corona_data_01 + "\n";
            output_text += "해외 유입 : " + today_corona_data_02;

            replier.reply(output_text);
        }


        /*   비트코인 가격   */
        if(dict_cmd[msg] == "/btckrw"){
            let google_coin_search = org.jsoup.Jsoup.connect("https://www.google.com/search?q=qlxmzhdls+rkrur&oq=qlxmzhdls+rkrur&aqs=chrome..69i57.1112j0j4&sourceid=chrome&ie=UTF-8").get();
            let google_coin_search_btc = google_coin_search.select("span.DFlfde.SwHCTb").get(0).text();
            output_text += "[GOOGLE SEARCH]\n";
            output_text += "BTC/KRW : " + google_coin_search_btc + " 원";
            replier.reply(output_text);
        }


        /*   한강 수온   */
        if (dict_cmd[msg] == "/한강수온" || (msg.includes("인생") && msg.includes("싼다"))){
            let hangang_server_raw = org.jsoup.Jsoup.connect("http://hangang.dkserver.wo.tc").get().text();
            let hangang_json = JSON.parse(hangang_server_raw);
            replier.reply("현재 한강 수온은 "+ hangang_json.temp + "도 입니다.");
        }


        /*   롱숏비율   */
        if(dict_cmd[msg] == "/longshort"){
            let funding_history_raw = org.jsoup.Jsoup.connect("https://www.binance.com/futures/data/openInterestHist?symbol=BTCUSDT&period=5m").ignoreContentType(true).get().text();
            let funding_history_json = JSON.parse(funding_history_raw);
            output_text += "미결제 약정\n" + parseFloat(funding_history_json[29].sumOpenInterest).toFixed(3) + " BTC\n\n";
            output_text += "미결제 약정의 명목 가치\n" + parseFloat(funding_history_json[29].sumOpenInterestValue).toFixed(2)  + " USDT\n\n";

            let longshort_ratio_raw = org.jsoup.Jsoup.connect("https://www.binance.com/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=5m").ignoreContentType(true).get().text();
            let longshort_ratio_json = JSON.parse(longshort_ratio_raw);
            output_text += "롱 계정 : " + (longshort_ratio_json[29].longAccount * 100).toFixed(2) + "%\n";
            output_text += "숏 계정 : " + (longshort_ratio_json[29].shortAccount * 100).toFixed(2) + "%";

            replier.reply(output_text);
        }


        


        /*   단순 명령어 종료   */





        
        /*   혼합 명령어   */



        /*   번역   */
        if(str_split_Arr[0] == "/영한" || str_split_Arr[0] == "/한영" || str_split_Arr[0] == "/한일" || str_split_Arr[0] == "/일한"){
            if(str_split_Arr.length == 1){
                replier.reply(err_func(2));
            }
            
            else if(splited_msg[0] == "/영한"){    
                papago_Api_Tr_result = Api.papagoTranslate("en","ko",splited_data);
                replier.reply("en->ko : " + papago_Api_Tr_result);
            }

            else if(splited_msg[0] == "/한영"){    
                papago_Api_Tr_result = Api.papagoTranslate("ko","en",splited_data);
                replier.reply("ko->en : " + papago_Api_Tr_result);
            }

            else if(splited_msg[0] == "/일한"){   
                papago_Api_Tr_result = Api.papagoTranslate("ja","ko",splited_data);
                replier.reply("ja->ko : " + papago_Api_Tr_result);
            }

            else if(splited_msg[0] == "/한일"){    
                papago_Api_Tr_result = Api.papagoTranslate("ko","ja",splited_data);
                replier.reply("ko->ja : " + papago_Api_Tr_result);
            }
        }


        /*   네이버검색   */
        if(dict_cmd[str_split_Arr[0]] == "/네이버 (검색할 문장)"){
            if(str_split_Arr.length == 1){
                replier.reply(err_func(3));
            }
            else{
                replier.reply("네이버 검색 : https://m.search.naver.com/search.naver?query=" + splited_data.replace(/ /g, "%20"));
            }
        }
        

        /*   구글검색   */
        if(dict_cmd[str_split_Arr[0]] == "/구글 (검색할 문장)"){
            if(str_split_Arr.length == 1){
                replier.reply(err_func(3));
            }
            else{
                replier.reply("구글 검색 : https://www.google.com/search?q=" + splited_data.replace(/ /g, "%20"));
            }
            
        }

        

        /*   랜덤   */
        if(dict_cmd[str_split_Arr[0]] == "/랜덤 (옵션1) (옵션2) (옵션3)..."){
            if(str_split_Arr.length == 1){
                replier.reply(err_func(5));
            }

            else{
                str_split_Arr.shift();
                replier.reply(str_split_Arr[Math.floor(Math.random() * str_split_Arr.length)]);
            }
        }


        /*   나무위키   */
        if(dict_cmd[str_split_Arr[0]] == "/나무위키 (검색)"){
            try{
                namu_encodeURI = encodeURI(splited_data);
                //namu_raw_data = org.jsoup.Jsoup.connect("https://namu.wiki/w/" + namu_encodeURI).userAgent("Mozilla").get();
                //namu_value = namu_raw_data.split('<div class="wiki-heading-content">')[1].split('<h2 class="wiki-heading">')[0].replace(/(<([^>]+)>)/g, "").trim().substring(0,200)+"...";
                //replier.reply(splited_data + "에 대한 결과입니다.\n" + namu_value + "\n\n자세한내용은 " + "https://namu.wiki/w/" + namu_encodeURI + " 을 참고해주세요");
                replier.reply("https://namu.wiki/w/" + namu_encodeURI );
            }
            
            catch (error) {
                replier.reply("나무위키에서 " + splited_data + "을(를) 찾을 수 없거나 오류가 있습니다.\n" + error);
            }

        }


        /*   날씨   */
        if(dict_cmd[str_split_Arr[0]] == "/날씨 (지역)"){

            if(msg.trim() == "/날씨"){
                let weather_data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨").get();
                weather_data = weather_data.select("div.lcl_lst").get(0);
                weather_data = weather_data.select("a");
                let weather_output_text = [];
                for (let n = 0; n < weather_data.size(); n++) {
                    weather_output_text[n] = weather_data.get(n).text();
                }     
                replier.reply("[전국 날씨 정보]\n\n" + weather_output_text.join("\n").replace(/도씨/g, "℃"));
                
            }

            else{
                let local_weather_data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=" + splited_data.replace(/ /g, "+") + "+날씨").get();
                local_weather_data = local_weather_data.select("div.status_wrap");
                let local_temp = local_weather_data.select("strong").get(0).text();
                local_temp = local_temp.replace("현재 온도", "온도 : ").replace("°", "℃");
                let local_state = local_weather_data.select("div.weather_main").get(0).text();
                let local_hum = local_weather_data.select("li.type_humidity").select("span").get(0).text();
                output_text = "[" + splited_data + " 날씨 정보]\n\n" + "상태 : " + local_state + "\n" + local_temp + "\n습도 : " + local_hum +"\n\n";
                
                dust_raw_data = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?query=" + splited_data.replace(/ /g, "+") + "+날씨")
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36")
                .get().select("dl.indicator").get(0).select("dd");
                big_dust_data = dust_raw_data.get(0).text().replace("㎍/㎥", "μg/m³ (") + ")";
                small_dust_data = dust_raw_data.get(1).text().replace("㎍/㎥", "μg/m³ (") + ")";
                ozone_data = dust_raw_data.get(2).text().replace("ppm", "ppm (") + ")";

                output_text += ("미세먼지: " + big_dust_data + "\n초미세먼지: " + small_dust_data + "\n오존: " + ozone_data);
                replier.reply(output_text);
                
            }

        }
        
        
        /*   업비트 코인가격   */
        if(dict_cmd[str_split_Arr[0]] == "/업비트 (코인심볼)"){
            try{
                let upbit_coin_symbol = "BTC";
                if(str_split_Arr.length != 1){
                    upbit_coin_symbol = splited_data;

                    let coin_symbol_krw = JSON.parse(org.jsoup.Jsoup.connect("https://api.upbit.com/v1/market/all").ignoreContentType(true).get().text());
                    for (let i in coin_symbol_krw) {
                        let keywordData = coin_symbol_krw[i];
                        let keywordData_replaced = keywordData["korean_name"].replace(/(<([^>]+)>)/ig, " ");
        
                        if (keywordData_replaced == splited_data) {
                            upbit_coin_symbol = keywordData["market"].replace(/(<([^>]+)>)/ig, " ").split("-")[1];
                        }
                    }
                }

                upbit_coin_symbol = upbit_coin_symbol.toUpperCase();
                let upbit_json = upbit_func(upbit_coin_symbol);

                output_text += "[UPBIT API]\n";
                output_text += "<" + upbit_coin_symbol + "/KRW>\n";
                output_text += numberWithCommas(upbit_json[0].trade_price) + " (" + ((upbit_json[0].signed_change_rate)*100).toFixed(2) + "%)\n\n";
                output_text += "24H 고가 : " + numberWithCommas(upbit_json[0].high_price) + " KRW\n";
                output_text += "24H 저가 : " + numberWithCommas(upbit_json[0].low_price) + " KRW\n";
                output_text += "24H 종가 : " + numberWithCommas(upbit_json[0].prev_closing_price) + " KRW";
                replier.reply(output_text);

            }

            catch(error){
                replier.reply("해당 코인이 존재하지 않습니다\n" + error);
            }

        }


        /*   바이낸스 코인가격   */
        if(dict_cmd[str_split_Arr[0]] == "/바이낸스 (코인심볼)"){
            try{
                let binance_coin_symbol = "BTC";
                if(str_split_Arr.length != 1){
                    binance_coin_symbol = splited_data;
                }
                binance_coin_symbol = binance_coin_symbol.toUpperCase();
                let binance_json = binance_func(binance_coin_symbol);

                output_text += "[BINANCE API]\n";
                output_text += binance_coin_symbol + "/USDT : ";
                output_text += numberWithCommas(parseFloat(binance_json.price)) + " USDT";
                replier.reply(output_text);
            }
            catch(error){
                replier.reply("해당 코인이 존재하지 않습니다\n" + error);
            }
        }

        
        /*   김치프리미엄 계산   */
        if(dict_cmd[str_split_Arr[0]] == "/김프 (코인심볼)"){
            try{
                output_text += "<김치 프리미엄>\n";
                output_text += "[BINANCE / UPBIT]\n\n";

                let coin_symbol = "BTC";
                if(str_split_Arr.length != 1){
                    coin_symbol = splited_data;

                    let coin_symbol_krw = JSON.parse(org.jsoup.Jsoup.connect("https://api.upbit.com/v1/market/all").ignoreContentType(true).get().text());
                    for (let i in coin_symbol_krw) {
                        let keywordData = coin_symbol_krw[i];
                        let keywordData_replaced = keywordData["korean_name"].replace(/(<([^>]+)>)/ig, " ");
        
                        if (keywordData_replaced == splited_data) {
                            coin_symbol = keywordData["market"].replace(/(<([^>]+)>)/ig, " ").split("-")[1];
                        }
                    }
                }
                coin_symbol = coin_symbol.toUpperCase();

                let binance_json = binance_func(coin_symbol);
                output_text += coin_symbol + "/USDT : ";
                output_text += numberWithCommas(parseFloat(binance_json.price)) + " USDT\n";
                
                let upbit_json = upbit_func(coin_symbol);
                output_text += coin_symbol + "/KRW : ";
                output_text += numberWithCommas(parseFloat(upbit_json[0].trade_price)) + " KRW\n";

                let usdkrw_result = usdkrw_func();
                output_text += "USD/KRW 환율 : " + numberWithCommas(usdkrw_result) + "\n";

                output_text += coin_symbol + " 김프 : ";
                let kimp = (parseFloat(upbit_json[0].trade_price) / (parseFloat(binance_json.price) * usdkrw_result) * 100 - 100).toFixed(5);
                output_text += String(kimp) + "%";
                replier.reply(output_text);

            }

            catch(error){
                replier.reply("해당 코인이 존재하지 않거나 오류가 있습니다\n" + error);
            }

        }


        /*   라프텔 애니검색   */
        if(dict_cmd[str_split_Arr[0]] == "/라프텔 (애니제목)"){
            try{
                let laftel_search = laftel(splited_data);
                let laftel_result = JSON.parse(laftel_search.text());
                replier.reply(laftel_result);
            }

            catch(error){
                replier.reply(error);
            }

        }






        /*   혼합 명령어 종료   */








        /*   자연어   */
        

        for(let dict_key in dict_inc){
            if(msg.includes(dict_key)){
            replier.reply(dict_inc[dict_key]);
            }
        }
        

        if(dict_nat[msg]){
            replier.reply(dict_nat[msg]);
        }

        
        /*   자연어 종료   */



        /*   읽음으로 표시하기   */
    
    }
    catch(catch_error_reply){
        replier.reply(catch_error_reply);
    }

}





/*   명령어 저장   */
function dict_init(dict_nat, dict_cmd, dict_inc){             

    


    /*   단순명령어 저장부   */
    
    dict_cmd["/테스트"] = dict_cmd["/test"] = dict_cmd["/tt"] = "/test";
    dict_cmd["/컴파일"] = dict_cmd["/compile"] = dict_cmd["/cc"] = "/compile";
    dict_cmd["/info"] = dict_cmd["/정보"] = dict_cmd["/상태"] = "/info";
    dict_cmd["/help"] = dict_cmd["/도움"] = dict_cmd["/명령어"] = "/help";
    dict_cmd["/time"] = dict_cmd["/시간"] = dict_cmd["/현재시간"] = dict_cmd["/현재시각"] = "/time";
    dict_cmd["/전역일"] = dict_cmd["/전역"] = "/전역";
    dict_cmd["/weather"] = dict_cmd["/전국날씨"] = "/전국날씨";
    dict_cmd["/펀비타임"] = dict_cmd["/펀비"] = dict_cmd["/fbtime"] = "/펀비";
    dict_cmd["/코로나"] = dict_cmd["/corona"] = "/코로나";
    dict_cmd["/비트코인"] = dict_cmd["/btckrw"] = "/btckrw";
    dict_cmd["/한강수온"] = dict_cmd["/한강 수온"] = dict_cmd["/한강"] = "/한강수온";
    dict_cmd["/롱숏비율"] = dict_cmd["/롱숏"] = dict_cmd["/longshort"] = "/longshort";
    



    /*   혼합 명령어 저장부   */

    dict_cmd["/한영"] = "/한영 (번역할 문장)";
    dict_cmd["/영한"] = "/영한 (번역할 문장)";
    dict_cmd["/한일"] = "/한일 (번역할 문장)";
    dict_cmd["/일한"] = "/일한 (번역할 문장)";
    dict_cmd["/검색"] = dict_cmd["/search"] = dict_cmd["/네이버검색"] = dict_cmd["/naver"] = dict_cmd["/네이버"] = "/네이버 (검색할 문장)";
    dict_cmd["/구글검색"] = dict_cmd["/google"] = dict_cmd["/구글"] = "/구글 (검색할 문장)";
    dict_cmd["/랜덤"] = "/랜덤 (옵션1) (옵션2) (옵션3)...";
    dict_cmd["/나무위키"] = dict_cmd["/나무"] = dict_cmd["/위키"] = "/나무위키 (검색)";
    dict_cmd["/날씨"] = dict_cmd["/미세먼지"] = "/날씨 (지역)";
    dict_cmd["/업비트"] = dict_cmd["/upbit"] = "/업비트 (코인심볼)";
    dict_cmd["/바이낸스"] = dict_cmd["/binance"] = dict_cmd["/바낸"] = "/바이낸스 (코인심볼)";
    dict_cmd["/김프"] = dict_cmd["/김치프리미엄"] = dict_cmd["/kimp"] = "/김프 (코인심볼)";
    //dict_cmd["/라프텔"] = "/라프텔 (애니제목)";



    /*   자연어 저장부   */
    dict_nat["에이펙스"] = "레전드";
    dict_nat["자러감"] = dict_nat["잘게"] = dict_nat["자야지"] = "잘자";
    dict_nat["헤으응"] = "뉸나나죽어...";
    dict_nat["퇴근"] = "ㅊㅊ~";
    dict_nat["도지"] = "화성 갈끄니까~";

    /*   dict_nat["예아"] = dict_nat["ㅖㅏ"] = "안될거 뭐있노~";   */



    /*   포함된 자연어 저장부   */
    
    dict_inc["모잠비크"] = "모잠비크 히야";
    dict_inc["타이완"] = "따이완 넘버원~";

}


/*   오류코드 반환   */
function err_func(err_code){                        
    
    let ret_str = "ERR CODE :  " + err_code + "\n";


    switch(err_code){
        default :
            ret_str += "UNKNOWN ERROR";
            break;

        case 0:
            ret_str += "ERR0";
            break;
        
        case 1:
            ret_str += "ERR1";
            break;

        case 2:
            ret_str += "번역할 문자를 빈칸을 띄우고 입력해주세요";
            break;

        case 3:
            ret_str += "검색할 내용을 빈칸을 띄우고 입력해주세요";
            break;
            
        case 4:
            ret_str += "검색할 지역을 빈칸을 띄우고 입력해주세요";
            break;

        case 5:
            ret_str += "랜덤 인수가 없습니다";
            break;
    
    }


    return ret_str;
}


/*   변수 초기화 (response 실행시)   */
function initialize(){
    output_text = "";
}


/*   봇 컴파일   */
function recompile_bot_func(){
    let compile_result = Api.compile("DOGE_BOT");
    if(compile_result == true){
        return "Compile Complete";
    }
    else{
        return "Compile Failed";
    }
}


/*   USD/KRW 원달러환율   */
function usdkrw_func(){
    let usdkrw_url = "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD";
    let usdkrw_json = JSON.parse(org.jsoup.Jsoup.connect(usdkrw_url).ignoreContentType(true).get().text());
    let usdkrw = usdkrw_json[0].basePrice;
    return usdkrw;
}


/*   바이낸스 JSON 함수   */
function binance_func(coin_symbol){
    let binance_url = "https://api.binance.com/api/v3/ticker/price?symbol=";
    binance_url += coin_symbol + "USDT";
    return JSON.parse(org.jsoup.Jsoup.connect(binance_url).ignoreContentType(true).get().text());
}



/*   업비트 JSON 함수   */
function upbit_func(coin_symbol){
    let upbit_url = "https://api.upbit.com/v1/ticker?markets=KRW-";
    upbit_url += coin_symbol;
    return JSON.parse(org.jsoup.Jsoup.connect(upbit_url).ignoreContentType(true).get().text());
}


/*   화폐단위 컴마출력   */
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




/*   텔레그램 알림   */
function onNotificationPosted(StatusBarNotification, sbn) {

    //Device.acquireWakeLock(android.os.PowerManager.PARTIAL_WAKE_LOCK, "wakelock kakao", -1);

    sbn.bindSession("org.telegram.messenger");
    if (StatusBarNotification.getOpPkg()=="org.telegram.messenger"){
        let tele_data = StatusBarNotification.getNotification().extras;

        if (tele_data.getString("android.text") && !tele_data.getString("android.text").startsWith("대화방")){
            let tele_same_tmp = 0;
            for (let i = 0; i < 100; i++){
                if(tele_data.getString("android.text") == same_alarm[i]){
                    tele_same_tmp = 1;
                }
            }

            if(tele_same_tmp == 0){
                //Api.replyRoom("홍범순", tele_data.getString("android.text"), "com.kakao.talk");
                Api.replyRoom("바이낸스 종합 시그널방", tele_data.getString("android.text"), "com.kakao.talk");
                same_alarm[same_alarm_idx] = tele_data.getString("android.text");
                same_alarm_idx++;
                same_alarm_idx = same_alarm_idx % 100;
            }
        }
    }


    /*
    sbn.bindSession("com.coinness");
    if (StatusBarNotification.getOpPkg()=="com.coinness"){
        let tele_data = StatusBarNotification.getNotification().extras;

        if (tele_data.getString("android.text")){

            let tele_same_tmp = 0;
            for (let i = 0; i < 100; i++){
                if(tele_data.getString("android.text") == same_alarm[i]){
                    tele_same_tmp = 1;
                }
            }

            if(tele_same_tmp == 0){
                //Api.replyRoom("홍범순", tele_data.getString("android.text"), "com.kakao.talk");
                Api.replyRoom("signalroom", tele_data.getString("android.text"), "com.kakao.talk");
                same_alarm[same_alarm_idx] = tele_data.getString("android.text");
                same_alarm_idx++;
                same_alarm_idx = same_alarm_idx % 100;
            }

        }
    }
    */

    //Device.releaseWakeLock();


}


/*   라프텔 애니검색   */
function laftel(str) {
    let res = org.jsoup.Jsoup.connect("http://laftel.net/api/search/v1/keyword/?keyword=" + str)
        .header("authorization", "Token a06d1ed6a69f5ab4001b734cc5afa894a717bdcb")
        .header("laftel", "TeJava").ignoreContentType(true).ignoreHttpErrors(true).get();
    return res;
}
