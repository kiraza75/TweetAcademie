function modifAccount(){
    const regMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPhone = /^[0-9]{8,}$/;
    let modify = {
        cookie: cookie,
        username: $("#modifUsername").val(),
        fullname: $("#modifPseudo").val(),
        bio: $("#modifBio").val(),
        location: $("#modifLocations").val(),
        email: $("#modifMail").val(),
        birthday: $("#modifDate").val(),
        tel: $("#modifPhone").val(),
        pwd: $("#modifPass").val(),
        pwdConf: $("#modifPassConf").val()
    };
    modify.username.length === 0 ? $("#modifUsername").css("color", "") : modify.username.length < 6 ? $("#modifUsername").css("color", "red") : $("#modifUsername").css("color", "green");
    modify.fullname.length === 0 ? $("#modifPseudo").css("color", "") : modify.fullname.length < 4 ? $("#modifPseudo").css("color", "red") : $("#modifPseudo").css("color", "green");
    modify.bio.length === 0 ? $("#modifBio").css("color", "") : modify.bio.length < 10 ? $("#modifBio").css("color", "red") : $("#modifBio").css("color", "green");
    modify.location.length === 0 ? $("#modifLocations").css("color", "") : modify.location.length < 4 ? $("#modifUsername").css("color", "red") : $("#modifUsername").css("color", "green");
    modify.email.length === 0 ? $("#modifMail").css("color", "") : !modify.email.match(regMail) ? $("#modifMail").css("color", "red") : $("#modifMail").css("color", "green");
    modify.birthday.length === 0 ? $("#modifDate").css("color", "") : Date.now() - Date.parse(modify.birthday) < (60 * 60 * 24 * 365.25 * 18 * 1000) ? $("#modifDate").css("color", "red") : $("#modifDate").css("color", "green");
    modify.tel.length === 0 ? $("#modifPhone").css("color", "") : !modify.tel.match(regPhone) ? $("#modifPhone").css("color", "red") : $("#modifPhone").css("color", "green");
    modify.pwd.length === 0 ? $("#modifPass").css("color", "") : modify.pwd.length < 8 ? $("#modifPass").css("color", "red") : $("#modifPass").css("color", "green");
    modify.pwdConf.length === 0 ? $("#modifPassConf").css("color", "") : modify.pwdConf.length < 8 ? $("#modifPassConf").css("color", "red") : $("#modifPassConf").css("color", "green");
    modify.pwd !== modify.pwdConf ? $("#modifPass").css("color", "red") : $("#modifPass").css("color", "green");
    modify.pwdConf !== modify.pwd ? $("#modifPassConf").css("color", "red") : $("#modifPassConf").css("color", "green");

    if (modify.pwd !== modify.pwdConf){
        $("#error").text("Relisez vous.");
        return false;
    }
    else {
        fetch("http://localhost:8080/modifyAccount", {
            method: "POST",
            body: JSON.stringify(modify),
            headers: {
                "content-type": "application/json"
            }
        }).then((resp) => resp.json())
            .then(val => {
                console.log(val);
                if (val === "success"){
                    scroll = 0;
                    getInfo();
                    $("#showTweet").html("");
                }
            });
    }
}

function deleteAccount(){
    let body = {
        cookie: cookie
    };
    fetch("http://localhost:8080/deleteAccount", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            if(val === "success"){
                localStorage.setItem("cookie", "");
                window.location = "http://localhost/tweet/client/connect.html";
            }
        });
}

function contact(){
    let body = {
        cookie: cookie,
        id: $("#username").data("id")
    };
    fetch("http://localhost:8080/contact", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.log(val);
        });
}

function follow(){
    let body = {
        cookie: cookie,
        id: $("#username").data("id")
    };
    fetch("http://localhost:8080/follow", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    }).then((resp) => resp.json())
        .then(val => {
            console.log(val);
        });
}

$(document).ready( function () {
    $("#modifValid").click(function (e) {
        e.preventDefault();
        modifAccount();
    });
    $("#delete").click(function (e) {
        e.preventDefault();
        deleteAccount();
    });
    $(document).on("click", "#followBtn", function () {
        follow();
    });
    $(document).on("click", "#contactBtn", function () {
        contact();
    });
});