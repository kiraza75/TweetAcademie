const API_URL = "http://localhost:8080/inscription";

function verif(register){
    const regMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regPhone = /^[0-9]{8,}$/;
    register.user.length < 6 ? $("#username").css("color", "red") : $("#username").css("color", "green");
    register.pass.length < 8 ? $("#password").css("color", "red") : $("#password").css("color", "green");
    register.passConf.length < 8 ? $("#passwordConf").css("color", "red") : $("#passwordConf").css("color", "green");
    register.pass !== register.passConf ? $("#password").css("color", "red") : $("#password").css("color", "green");
    register.passConf !== register.pass ? $("#passwordConf").css("color", "red") : $("#passwordConf").css("color", "green");
    Date.now() - Date.parse(register.date) < (60 * 60 * 24 * 365.25 * 18 * 1000) ? $("#date").css("color", "red") : $("#date").css("color", "green");
    !register.mail.match(regMail) ? $("#mail").css("color", "red") : $("#mail").css("color", "green");
    !register.phone.match(regPhone) ? $("#phone").css("color", "red") : $("#phone").css("color", "green");
    if (register.user.length < 6 || register.pass !== register.passConf || Date.now() - Date.parse(register.date) < (60 * 60 * 24 * 365.25 * 18 * 1000) ||  !register.mail.match(regMail) || register.pass.length < 8 || !register.phone.match(regPhone)){
        $("#error").text("Relisez vous.");
        return false;
    }
    else {
        $("#error").text("");
        return true;
    }

}

$(document).ready(function () {
    $("#register").submit(function (e) {
        e.preventDefault();
        const user = $("#username").val();
        const pass = $("#password").val();
        const passConf = $("#passwordConf").val();
        const date = $("#date").val();
        const mail = $("#mail").val();
        const phone = $("#phone").val();
        const register = {
            user, pass, passConf, date, mail, phone
        };

        if (verif(register)) {
            fetch(API_URL, {
                method: "POST",
                body: JSON.stringify(register),
                headers: {
                    "content-type": "application/json"
                }
            }).then((resp) => resp.json())
                .then(val => {
                    console.log(val)
                    if (val === "success") {
                        $("#error").text("");
                        window.location = "http://localhost/tweet/client/login.html";
                    } else $("#error").text(val);
                });
        }
    });
    $("#login").click(function () {
        window.location = "http://localhost/tweet/client/login.html";
    });
});