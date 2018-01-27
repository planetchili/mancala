"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Test_1 = require("../../Test");
describe("Test", () => {
    let t;
    beforeEach(() => {
        t = new Test_1.Test("pubes");
    });
    it("should do the thing right", () => {
        expect(t.Trial()).toEqual("pubes@");
    });
});
