$(document).ready(function () {
    $("#click-me").click(function (event) {
        event.preventDefault();
        $(".vertex").first().height(200);
        $(".vertex").first().width(200);
    });
});
