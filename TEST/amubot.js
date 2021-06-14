let msg_arr = {};
msg_arr["zzz"] = "good night";
msg_arr["hello"] = "hello world!";


function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    if(msg_arr[msg]){
        replier.reply(msg_arr[msg]);
    }
}