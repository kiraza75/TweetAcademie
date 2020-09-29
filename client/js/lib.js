$(document).ready(function () {
    if(localStorage.getItem("theme") !== null)
        $("#bootstrap").attr("href", localStorage.getItem("theme"));
});