import * as $ from "jquery";

$(document).ready(() =>
{
    $("p").click(() =>
    {
        $("#shame").text( "Shame!" );
    });
});