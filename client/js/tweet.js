let scroll = 0;
let size = 10;

function tweet(){
    let body = {
        cookie: cookie,
        tweet: $("#tweet").val(),
        type: "tweet"
    };
    let formData = new FormData();
    let files = $("#tweetImg")[0].files[0];
    if($("#tweetImg")[0].files[0] !== undefined) {
        if (files.type.indexOf("image/") !== -1)
            body.type = "image";
        formData.append("file", files);
    }
    formData.append("body", JSON.stringify(body));
    $.ajax({
        url: "http://localhost:8080/tweet",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: val => {
            console.log(val);
            $("#showTweet").html("");
            scroll = 0;
            scroll = getTweet(scroll, size);
        },
        error: error => {
            console.log(error)
        }
    });
}

function deleteTweet(id) {
    let body = {
      id: id,
      cookie: cookie
    };
    fetch("http://localhost:8080/deleteTweet", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.table(val);
            $("#showTweet").html("");
            scroll = 0;
            scroll = getTweet(scroll, size);
        });
}

function like(id) {
    let body = {
        id: id,
        cookie: cookie
    };
    fetch("http://localhost:8080/like", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.table(val);
            $("#showTweet").html("");
            scroll = 0;
            scroll = getTweet(scroll, size);
        });
}

function retweet(id) {
    let body = {
        id: id,
        cookie: cookie
    };
    fetch("http://localhost:8080/retweet", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.table(val);
            $("#showTweet").html("");
            scroll = 0;
            scroll = getTweet(scroll, size);
        });
}

function getTweet(scroll, size, id){
    let body = {
        cookie: cookie,
        scroll: scroll,
        size: size
    };
    if (id !== undefined || id !== null)
        body.id = id;
    console.log(body)
    fetch("http://localhost:8080/getWallTweet", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.table(val);
            for(i in val){
                let card = "<div class='card'><div class='card-header bg-twitter-6 text-white d-flex justify-content-between'>Tweet <a data='"+val[i].id+"' class='deleteTweet btn btn-sm btn-danger'>X</a></div><div class='card-body'>" +
                    "<div class='row'><img style='border-radius: 9999px' class='card-img-top col-md-3' src='"+val[i].profil_img+"' alt='profile image'>" +
                    "<div class='col-md-3'><p class='getUser text-twitter-5' style='cursor: pointer' data-id='" + val[i].user_id +"'>@"+val[i].username+"</p></div><div class='col-md-3'><p class='text-muted'>"+Date(Date.parse(val[i].date)).substr(0,15)+"</p>" +
                    "</div><p class='card-text col-md-12'>"+val[i].content+"</p><img class='col-md-12' alt='Content' src='http://localhost:8080/image/"+val[i].paths+"'></div></div>" +
                    "<div class='card-footer d-flex justify-content-between'><button data='"+val[i].user_id+"' class='like btn btn-sm btn-twitter-2'>Like</button><article class='text-twitter-5'>"+val[i].likes+"&hearts;</article>" +
                    "<article  class='text-twitter-5'>"+val[i].retweet+"&#8362;</article><button data='"+val[i].id+"' class='retweet btn btn-sm btn-twitter-2'>Retweet</button></div></div><br>";
                $("#showTweet").append(card);
            }
        });
    return scroll+size;
}

$(document).ready( function () {
    let working = false;
    scroll = getTweet(scroll, size);
    $(window).scroll(function () {
        if ($(this).scrollTop() + 1 >= $("body").height() -$(window). height()){
            if (working === false){
                working = true;
                scroll = getTweet(scroll, size);
                setTimeout(function () {
                    working = false;
                });
            }
        }
    });
    $("#tweeter").click( function (e) {
        e.preventDefault();
        tweet();
    });
    $("#setting").click( function () {
        scroll = 0;
    });
    $(document).on("click", ".deleteTweet", function () {
        deleteTweet($(this).attr("data"));
    });
    $(document).on("click", ".like", function () {
        like($(this).attr("data"));
    });
    $(document).on("click", ".retweet", function () {
        retweet($(this).attr("data"));
    });
});