const API_URL = "http://localhost:8080/login";

$(document).ready(function() {
    $("#login").submit(function (e) {
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();

        const login = {
            username, password
        };

        fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(login),
            headers:{
                "content-type": "application/json",
            }
        }).then((res) => res.json())
            .then(val => {
                if(val !== "aucun username/email ou telephone de trouver") {
                    localStorage.setItem("cookie", val);
                    window.location = "http://localhost/tweet/client/home.html";
                }
            })
    });

});