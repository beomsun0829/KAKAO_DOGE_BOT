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