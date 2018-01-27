import * as $ from "jquery";
import {Test} from "./Test";

$(document).ready(() =>
{
    let test = new Test("Hello Shitworld!");
    $("p").click(() =>
    {
        test.Do();
    });
});