


let output_text = "";

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    output_text = "";

    /*   테스터   */
    if(msg == "/tt"){
        

    }

    if(msg == "/tt2"){



    }

    


    /*   컴파일   */

    if(msg == "/cc"){
        output_text = "테스트봇 ";
        output_text += recompile_bot_func();
        replier.reply(output_text);
    }

}


function recompile_bot_func(){
    let compile_result = Api.compile("테스트봇");
    if(compile_result == true){
        return "Compile Complete";
    }
    else{
        return "Compile Failed";
    }
}



function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

