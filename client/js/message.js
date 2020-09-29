function sendMessage(){
    let body ={
        cookie: cookie,
        content: $("#messageContent").val(),
        id_receiver: 2
    };
    fetch("http://localhost:8080/sendMessage", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.table(val);
            $("#showTweet").html("");
        });
}

function getMessage(id){
    let interval = setInterval( function() {
        const compare =$("#chat").html();
        let body = {
            cookie: cookie,
            id: id
        };
        fetch("http://localhost:8080/getMessage", {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                let message = "";
                console.table(val);
                for (i in val) {
                    if (val[i].sender_id.toString() === id) {
                        message += "<div class='px-4 py-5 chat-box bg-white'> <div class='media w-50 mb-3'><img src='" + val[i].profil_img + "' alt='user' width='50' class='rounded-circle'>" +
                            "<div class='media-body ml-3'> <div class='bg-light rounded py-2 px-3 mb-2'> <p class='text-small mb-0 text-muted'>" + val[i].content + "</p> </div> <p class='small text-muted'>" + val[i].date + "</p> </div> </div>";
                    } else {
                        message += "<div class='media w-50 ml-auto mb-3'> <div class='media-body'> <div class='bg-twitter-5 rounded py-2 px-3 mb-2'>" +
                            "<p class='text-small mb-0 text-white'>" + val[i].content + "</p> </div> <p class='small text-muted'>" + val[i].date + "</p> </div> </div>";
                    }
                }
                if(compare !== message){
                    $("#chat").html("");
                    $("#chat").append(message)
                }
            });
    }, 1000);
    $("#home").click( function () {
        clearInterval(interval);
        $("#messageBox").addClass("d-none");
    });
}

function getConv(){
    let body ={
        cookie: cookie
    };
    fetch("http://localhost:8080/getConv", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.table(val);
            for(i in val){
                let conv = "<div data='"+val[i].id+"' class='list-group conv rounded-0'> <a class='list-group-item list-group-item-action bg-twitter-5 text-white rounded-0'> <div class='media'>" +
                    "<img src='"+val[i].profil_img+"' alt='user' width='50' class='rounded-circle'><div class='media-body ml-4'><div class='d-flex align-items-center justify-content-between mb-1'>" +
                    "<h6 class='mb-0'>"+val[i].username+"</h6><small class='small font-weight-bold'>"+val[i].fullname+"</small></div></div></div></a></div>";
                $("#messages-box").append(conv);
            }
        });
}

$(document).ready(function () {
    getConv();
    $("#message").click(function () {
        $("#account").addClass("d-none");
        $("#modif").addClass("d-none");
        $("#showTweet").addClass("d-none");
        $("#messageBox").removeClass("d-none");
    });
    $("#sendMessage").click(function (e) {
        e.preventDefault();
        sendMessage();
    });
    $(document).on("click", ".conv", function () {
            getMessage($(this).attr("data"));
    });
});