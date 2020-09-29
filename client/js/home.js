const API_URL = "http://localhost:8080/uploadImage";
const cookie = localStorage.getItem("cookie");

function getInfo(id) {
    let body  = {
        cookie: cookie,
        id: id
    };
    fetch("http://localhost:8080/getInfo", {
        method: "POST",
        body: JSON.stringify(body),
        headers:{
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then(data => {
            console.table(data);
            data.info.verified === 1 ? $("#username").html("@" + data.info.username + "<a style='color: #1e7e34'> ✔</a>️") : $("#username").text("@" + data.info.username);
            $("#username").attr("data-id", data.info.id);
            $("#pseudo").text("(" + data.info.fullname + ")");
            $("#subscribeDate").text("Register since: " + Date(Date.parse(data.info.registerDate)).substr(0, 15));
            $("#bio").text(data.info.bio);
            $("#follow").text(data.follow.nbr_follow);
            $("#abo").text(data.abo.nbr_abo);
            if(data.info.banner_img === "") {
                $("#bannerImage").attr("src", "");
            }
            else {
                $("#bannerImage").attr('src', "http://localhost:8080/image/" + data.info.banner_img);

            }
            if(data.info.profil_img === "") {
                $("#profilImage").attr("src", "");
            }
            else {
                $("#profilImage").attr('src', "http://localhost:8080/image/" + data.info.profil_img);
            }
            if(data.info.id !== data.id){
                $("#tweetTweet").addClass("d-none");
                $("#account").append("<a id='followBtn' class='text-white text-center btn btn-twitter-5 follow'><h5>Follow</h5></a>");
                $("#account").append("<a id='contactBtn' class='text-white text-center btn btn-twitter-5 follow'><h5>Contacter</h5></a>");
            }
            else {
                $("#tweetTweet").removeClass("d-none");
                $(".follow").delete();
            }
        })
}



$(document).ready(function () {
    getInfo();
    $(".theme").click(function () {
        $(".theme").removeClass("text-muted");
        $(this).addClass("text-muted");
        $("#bootstrap").attr("href", $(this).attr("value"));
        localStorage.setItem("theme", $(this).attr("value"));
    });
    $("#home").click(function () {
        scroll = 0;
        $("#showTweet").html("");
        getInfo();
        scroll = getTweet(scroll, size);
        $("#modif").addClass("d-none");
        $("#account").removeClass("d-none");
    });
    $("#modifProfilImg").change(function () {
        let formData = new FormData();
        let files = $(this)[0].files[0];
        formData.append("file", files);
        formData.append("cookie", cookie);
        formData.append("type", "profil");
        $.ajax({
            url: API_URL,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: val => {
                console.log(val)
            },
            error: error => {
                console.log(error)
            }
        });
    });
    $("#modifBannerImg").change(function () {
        let formData = new FormData();
        let files = $(this)[0].files[0];
        formData.append("file", files);
        formData.append("cookie", cookie);
        formData.append("type", "banner");
        $.ajax({
            url: API_URL,
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            success: val => {
                console.log(val)
            },
            error: error => {
                console.log(error)
            }
        });
    });
    $("#tweet").keyup(function () {
        $("#sizeTweet").text((140 - $(this).val().length) + " characters remaining.");
    });
    $("#setting").click(function () {
        scroll = 0;
        $("#showTweet").html("");
        $("#account").addClass("d-none");
        $("#modif").removeClass("d-none");
    })
});