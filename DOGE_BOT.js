

/*   선언   */

let doge_bot_ver = "1.22";
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




/*   선언 종료   */

/*   사전초기화   */
dict_init(dict_nat, dict_cmd, dict_inc);



function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    try{

        /*   초기화 섹션   */
        initialize();

        
        /*   단순 명령어   */


        /*   테스터   */
        

        
        if(dict_cmd[msg] == "/test"){   

            let scolkg_data = org.jsoup.Jsoup.connect("https://scolkg.com/").get();
            let kimp_per_div = scolkg_data.select("div.sectionKrw").get(0);
            let kimp_per_span = kimp_per_div.select("span");

            replier.reply(kimp_per_span);

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


        /*   펀비타임   */
        if(dict_cmd[msg] == "/펀비타임"){
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

            output_text += "현재시간 : " + now.toTimeString() + " KST\n\n";
            output_text += "Next Funding : " + Nearest_Funding_Time.toTimeString() + "\n\n";
            output_text += Nearest_Funding_left_hour + "시간 " + Nearest_Funding_left_mins + "분 " + Nearest_Funding_left_secs + "초 남았습니다";
            replier.reply(output_text);

        }


        /*   봇 컴파일   */
        if(dict_cmd[msg] == "/compile"){
            replier.reply(recompile_bot_func());
        }

        
        if(dict_cmd[msg] == "/코로나"){
            let corona_webtext = Utils.getWebText("https://www.ytn.co.kr/");
            
            let corona_data1 = corona_webtext;
            corona_data1 = corona_data1.replace(/<[^>]+>/g,"");
            corona_data1 = corona_data1.split("확진")[1];
            corona_data1 = corona_data1.split("명")[0];
            corona_data1 = corona_data1.trim();

            let corona_data2 = corona_webtext;
            corona_data2 = corona_data2.replace(/<[^>]+>/g,"");
            corona_data2 = corona_data2.split("완치")[1];
            corona_data2 = corona_data2.split("명")[0];
            corona_data2 = corona_data2.trim();

            let corona_data3 = corona_webtext;
            corona_data3 = corona_data3.replace(/<[^>]+>/g,""); corona_data3 = corona_data3.split("사망")[1];
            corona_data3 = corona_data3.split("명")[0];
            corona_data3 = corona_data3.trim();

            replier.reply("코로나19 국내현황(전체기간)\n\n확진 : "+corona_data1+"명\n완치 : "+corona_data2+"명\n사망 : "+corona_data3+"명");
        }

        


        /*   단순 명령어 종료   */





        
        /*   혼합 명령어   */


        /*   메세지 자르기   */
        
        str_split_Arr = [];
        splited_msg = msg.split(" ");
        splited_data = msg.replace(splited_msg[0] + " ","");
        str_split_Arr = msg.split(" ");


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

        
        /*   미세먼지   */
        if(dict_cmd[str_split_Arr[0]] == "/먼지 (지역이름)"){
            if(str_split_Arr.length == 1){
                replier.reply(err_func(4));
            }

            else{
                try{
                    dust_raw_data = org.jsoup.Jsoup.connect("https://search.naver.com/search.naver?query=" + splited_data.replace(/ /g, "+") + "+날씨")
                    .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36")
                    .get().select("dl.indicator").get(0).select("dd");
                    big_dust_data = dust_raw_data.get(0).text().replace("㎍/㎥", "μg/m³ (") + ")";
                    small_dust_data = dust_raw_data.get(1).text().replace("㎍/㎥", "μg/m³ (") + ")";
                    ozone_data = dust_raw_data.get(2).text().replace("ppm", "ppm (") + ")";
                    replier.reply("미세먼지: " + big_dust_data + "\n초미세먼지: " + small_dust_data + "\n오존: " + ozone_data);
                }
                catch(error){
                    replier.reply(error);
                }
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
                나무검색 = msg.trim().substring(6);
                나무검색값 = encodeURI(나무검색);
                나무위키 = Utils.getWebText("https://namu.wiki/w/" + 나무검색값);
                나무값 = 나무위키.split('<div class="wiki-heading-content">')[1].split('<h2 class="wiki-heading">')[0].replace(/(<([^>]+)>)/g, "").trim().substring(0,200)+"...";
                replier.reply(나무검색 + "에 대한 결과입니다.\n" + 나무값 + "\n\n자세한내용은" + "https://namu.wiki/w/" + 나무검색값 + "을 참고해주세요");

            }
            catch (e){
                replier.reply("나무위키에서 " + 나무검색 + "을(를) 찾을 수 없거나 오류가 있습니다.");
            }

        


        }


        /*   지역날씨   */
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
                let local_hum = local_weather_data.select("li.type_humidity").select("span").get(0).text();
                let local_state = local_weather_data.select("div.weather_main").get(0).text();
                let local_dust = local_weather_data.select("li.sign1").get(0);
                local_dust = local_dust.select("span.figure_text").text() + " (" + local_dust.select("span.figure_result").text() + ")";
                output_text = splited_data + " 날씨\n\n" +"상태 : " + local_state + "\n" + local_temp + "\n습도 : " + local_hum + "%\n미세먼지 : " + local_dust;
                replier.reply(output_text);
                
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


    replier.markAsRead();
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
    dict_cmd["/펀비타임"] = dict_cmd["/펀비"] = dict_cmd["/fbtime"] = "/펀비타임";
    dict_cmd["/코로나"] = dict_cmd["/corona"] = "/코로나";
    



    /*   혼합 명령어 저장부   */

    dict_cmd["/한영"] = "/한영 (번역할 문장)";
    dict_cmd["/영한"] = "/영한 (번역할 문장)";
    dict_cmd["/한일"] = "/한일 (번역할 문장)";
    dict_cmd["/일한"] = "/일한 (번역할 문장)";
    dict_cmd["/먼지"] = dict_cmd["/미세먼지"] = dict_cmd["/dust"] = "/먼지 (지역이름)";
    dict_cmd["/검색"] = dict_cmd["/search"] = dict_cmd["/네이버검색"] = dict_cmd["/naver"] = dict_cmd["/네이버"] = "/네이버 (검색할 문장)";
    dict_cmd["/구글검색"] = dict_cmd["/google"] = dict_cmd["/구글"] = "/구글 (검색할 문장)";
    dict_cmd["/랜덤"] = "/랜덤 (옵션1) (옵션2) (옵션3)...";
    dict_cmd["/나무위키"] = "/나무위키 (검색)";
    dict_cmd["/날씨"] = "/날씨 (지역)";



    /*   자연어 저장부   */
    dict_nat["에이펙스"] = "레전드";
    dict_nat["자러감"] = dict_nat["잘게"] = dict_nat["자야지"] = "잘자";
    dict_nat["헤으응"] = "뉸나나죽어...";
    dict_nat["퇴근"] = "ㅊㅊ~";
    dict_nat["도지"] = "화성 갈끄니까~";

    /*   dict_nat["예아"] = dict_nat["ㅖㅏ"] = "안될거 뭐있노~";   */



    /*   포함된 자연어 저장부   */
    
    dict_inc["우흥"] = "우흥~";
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





/* 추가해야될 목록


코인정보
유튜브 검색기능
명령어 목록 개인톡으로
시평갭
/가사 "노래제목"
현재포지션/잔고확인
김프
사진가져와서보여주기


*/