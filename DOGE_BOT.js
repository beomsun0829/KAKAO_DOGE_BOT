

/*   선언   */

var doge_bot_ver = "1.2v";
var dict_nat = {};
var dict_cmd = {};
var dict_inc = {};
dict_init(dict_nat, dict_cmd, dict_inc);

var splited_msg;
var splited_data;
var papago_Api_Tr_result;
var splited_data_chk;


/*   선언 종료   */


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    /*   단순 명령어   */



    /*   봇 정보   */
    if(dict_cmd[msg] == '>info'){               
        var info_msg_sender = "";
        info_msg_sender += "DOGE_BOT " + doge_bot_ver + " LIVE\n\n";
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

        var batt_health = ["BATTERY_STATUS_CHARGING",
                        "BATTERY_STATUS_DISCHARGING",
                        "BATTERY_STATUS_FULL",
                        "BATTERY_STATUS_NOT_CHARGING",
                        "BATTERY_STATUS_UNKNOWN"];

        var batt_status = ["BATTERY_HEALTH_COLD",
                        "BATTERY_HEALTH_DEAD",
                        "BATTERY_HEALTH_GOOD",
                        "BATTERY_HEALTH_OVERHEAT",
                        "BATTERY_HEALTH_OVER_VOLTAGE",
                        "BATTERY_HEALTH_UNKNOWN",
                        "BATTERY_HEALTH_UNSPECIFIED_FAILURE"];

        info_msg_sender += batt_status[Device.getBatteryStatus()] + "\n";
        info_msg_sender += batt_health[Device.getBatteryHealth()];

        replier.reply(info_msg_sender);
    }


    /*   명령어 목록   */
    if(dict_cmd[msg] == '>help'){                 

        var cmd_list_str = "명령어 목록 \n";
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
    if(dict_cmd[msg] == '>time'){                 
        var day = new Date();
        replier.reply("현재시간 : " + day.toLocaleString() + " KST");
    }


    /*   남은 전역일   */
    if(dict_cmd[msg] == '>전역'){                 
        var sdt = new Date();
        var edt = new Date('2022-05-22');

        var ans = "전역까지 ";
        var msec = edt.getTime() - sdt.getTime();

        ans += Math.ceil(msec/1000/60/60/24) + "일 ㅋㅋ 이걸 시간으로하면 ";
        ans += Math.ceil(msec/1000/60/60) + "시간 ㅋㅋ 이걸 분으로하면";
        ans += Math.ceil(msec/1000/60) + "분 ㅋㅋ 이걸 초로하면";
        ans += Math.ceil(msec/1000) + "초남음 ㅋㅋㅅㅂ";
        replier.reply(ans);
    }

    
    /*   날씨   */
    if (dict_cmd[msg] == ">날씨") {
        var data = org.jsoup.Jsoup.connect("https://m.search.naver.com/search.naver?query=날씨").get();
        data = data.select("div.lcl_lst").get(0);
        data = data.select("a");
        var result = [];
        for (var n = 0; n < data.size(); n++) {
            result[n] = data.get(n).text();
        }     
        replier.reply("[전국 날씨 정보]\n\n" + result.join("\n").replace(/도씨/g, "℃"));
    }



    /*   단순 명령어 종료   */





    
    /*   혼합 명령어   */


    /*   메세지 자르기   */
    splited_msg = msg.split(" ");
    splited_data = msg.replace(splited_msg[0] + " ","");
    splited_data_chk = msg.trim();

    /*   번역   */
    if(splited_msg[0] == ">영한" || splited_msg[0] == ">한영" || splited_msg[0] == ">한일" || splited_msg[0] == ">일한"){
    
        if(splited_data_chk == ">한영" || splited_data_chk == ">영한" || splited_data_chk == ">한일" || splited_data_chk == ">일한"){
            replier.reply(err_func(2));
        }
        
        else if(splited_msg[0] == ">영한"){    
            papago_Api_Tr_result = Api.papagoTranslate("en","ko",splited_data);
            replier.reply("en->ko : " + papago_Api_Tr_result);
        }

        else if(splited_msg[0] == ">한영"){    
            papago_Api_Tr_result = Api.papagoTranslate("ko","en",splited_data);
            replier.reply("ko->en : " + papago_Api_Tr_result);
        }

        else if(splited_msg[0] == ">일한"){   
            papago_Api_Tr_result = Api.papagoTranslate("ja","ko",splited_data);
            replier.reply("ja->ko : " + papago_Api_Tr_result);
        }

        else if(splited_msg[0] == ">한일"){    
            papago_Api_Tr_result = Api.papagoTranslate("ko","ja",splited_data);
            replier.reply("ko->ja : " + papago_Api_Tr_result);
        }
    }
    


    /*   혼합 명령어 종료   */








    /*   자연어   */
    

    for(var dict_key in dict_inc){
        if(msg.includes(dict_key)){
          replier.reply(dict_inc[dict_key]);
        }
    }
    

    if(dict_nat[msg]){
        replier.reply(dict_nat[msg]);
    }

    
     /*   자연어 종료   */



    

    /*   읽음으로 표시하기   */
    replier.markAsRead();


}



/*   명령어 저장   */
function dict_init(dict_nat, dict_cmd, dict_inc){             

    /*   명령어 저장부   */
    
    dict_cmd['>info'] = dict_cmd['>정보'] = dict_cmd['>상태'] = '>info';
    dict_cmd['>help'] = dict_cmd['>도움'] = dict_cmd['>명령어'] = '>help';
    dict_cmd['>time'] = dict_cmd['>시간'] = dict_cmd['>현재시간'] = dict_cmd['>현재시각'] = '>time';
    dict_cmd['>전역일'] = dict_cmd['>전역'] = '>전역';
    dict_cmd['>한영'] = '>한영 (번역할 문장)';
    dict_cmd['>영한'] = '>영한 (번역할 문장)';
    dict_cmd['>한일'] = '>한일 (번역할 문장)';
    dict_cmd['>일한'] = '>일한 (번역할 문장)';
    dict_cmd['>날씨'] = dict_cmd['>weather'] = dict_cmd['>전국날씨'] = '>날씨';



    /*   자연어 저장부   */
    dict_nat['에이펙스'] = '레전드';
    dict_nat['자러감'] = dict_nat['잘게'] = dict_nat['자야지'] = '잘자';
    dict_nat['헤으응'] = '뉸나나죽어...';
    dict_nat['퇴근'] = 'ㅊㅊ~';
    dict_nat['예아'] = dict_nat['ㅖㅏ'] = '안될거 뭐있노~';


    /*   포함된 자연어 저장부   */
    
    dict_inc['우흥'] = '우흥~';
    dict_inc['도지'] = '화성 갈끄니까~';
    dict_inc['모잠비크'] = '모잠비크 히야';
    dict_nat['타이완'] = '따이완 넘버원~';

}


/*   오류코드 반환   */
function err_func(err_code){                        
    
    var ret_str = "ERR CODE :  " + err_code + "\n";


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
            ret_str += "검색할 회사 이름을 빈칸을 띄우고 입력해주세요";
            break;
    
    }
    return ret_str;

}

    







/* 추가해야될 목록


코인정보
주식정보
네이버검색



*/