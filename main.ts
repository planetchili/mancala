import * as $ from "jquery";

class Test
{
    private msg : string;
    constructor( msg : string )
    {
        this.msg = msg;
    }
    public Do() : void
    {
        $("#shame").text(this.msg);
    }
}

$(document).ready(() =>
{
    let test = new Test("Hello Shitworld!");
    $("p").click(() =>
    {
        test.Do();
    });
});