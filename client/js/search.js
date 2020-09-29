const API_SEARCH = "http://localhost:8080/search";

function searchBar(val) {
    const q = {
        cookie: cookie,
        search: val
    };


    fetch(API_SEARCH, {
        method: "POST",
        body: JSON.stringify(q),
        headers: {
            "content-type": "application/json",
        }
    }).then((res) => res.json())
        .then(val => {
            console.table(val);
            if (val === "fail") {
                let errorMsg = "<div class='card'><div id='errorMsg' class='alert alert-danger'>Aucun resultats trouver esssayer un autre terme de recherche</div></div>"
                $('#account').html("");
                $('#showTweet').html("");
                $('#showTweet').append(errorMsg);

            }
            else {
                $("#showTweet").html("");

                for (let i in val) {
                    if (val[i].img === undefined || val[i].img === null) {
                        let cardResult = "<div class='card'><div class='card-header bg-twitter-6 text-white d-flex justify-content-between'>Tweet <a data='" + val[i].id + "' class='deleteTweet btn btn-sm btn-danger'>X</a></div><div class='card-body'>" +
                            "<div class='row'><img style='border-radius: 9999px' class='card-img-top col-md-3' src='" + val[i].profil_img + "' alt='profile image'>" +
                            "<div class='col-md-3'><p class='getUser text-twitter-5' data-id='"+val[i].id_u+"' style='cursor: pointer'>@" + val[i].username + "</p><p class='text-muted'>Published: " + Date(Date.parse(val[i].date)).substr(0, 15) + "</p>" +
                            "</div><p class='card-text col-md-6'>" + val[i].content + "</p><img class='col-md-12' alt='' src='http://localhost:8080/image/" + val[i].paths + "'></div></div></div>";
                        $("#showTweet").append(cardResult);
                        console.log(val[i]);
                    }
                    else {
                        console.log(val[i]);
                        let userResult = "<div class='card'><p data-id='"+val[i].id_u+"' class='text-twitter-5 getUser' style='cursor: pointer'> @"+val[i].username +"</p></div>" +
                            "<img style='border-radius: 9999px' class='card-img-top col-md-3' src='" + val[i].img + "' alt='profile image'>"
                        $('#showTweet').append(userResult);
                    }
                }
            }
        })
}

$(document).ready(function () {
    $("#search").submit(function (e) {
        e.preventDefault();
        searchBar($("#searchBar").val());
    });
    $(document).on("click", ".search", function (e) {
        e.preventDefault();
        searchBar($(this).text())
    });

    $(document).on("click", ".getUser", function (e) {
        $("#showTweet").html("");
        e.preventDefault();
        console.log( $(this).data("id"));
        getTweet(1, 999999999999999, $(this).data("id"));
        getInfo($(this).data("id"));
    });

});