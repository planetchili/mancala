"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $ = require("jquery");
class Test {
    constructor(msg) {
        this.msg = msg;
    }
    Do() {
        $("#shame").text(this.msg);
    }
    Trial() {
        return this.msg + "@";
    }
}
exports.Test = Test;
