var now = new Date();
var now_Hour = now.getHours();
var Nearest_Funding_Time;

if(now_Hour >= 01 && now_Hour < 09){
    Nearest_Funding_Time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0);
}

else if(now_Hour >= 09 && now_Hour < 17){
    Nearest_Funding_Time = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0, 0);
}

else{
    Nearest_Funding_Time = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0, 0);
}


var Nearest_Funding_left_secs = Nearest_Funding_Time.getSeconds() - now.getSeconds();
var Nearest_Funding_left_mins = Nearest_Funding_Time.getMinutes() - now.getMinutes();
var Nearest_Funding_left_hour = Nearest_Funding_Time.getHours() - now.getHours();

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

console.log("현재시간 : " + now.toTimeString() + " KST\n");
console.log("NEXT FUNDING TIME : " + Nearest_Funding_Time.toLocaleString() + "\n");
console.log(Nearest_Funding_left_hour + "시간 " + Nearest_Funding_left_mins + "분 " + Nearest_Funding_left_secs + "초 남았습니다");