"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
const Test_1 = require("./Test");
$(document).ready(() => {
    let test = new Test_1.Test("Hello Shitworld!");
    $("p").click(() => {
        test.Do();
    });
});
