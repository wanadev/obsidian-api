"use strict";

var APP_URL = location.protocol + "//" + location.hostname + ":3011";

var expect = require("expect.js");
var wanadevApp = require("../lib/integration.js");

describe("Integration", function() {

    before(function() {
        this.app = wanadevApp({
            htmlNode: "#target",
            appUrl: APP_URL
        });
    });

    it("calls the ready callback when the APP is ready", function(done) {
        this.app.on("ready", done);
    });

    it("can retrieve API's remote methods", function(done) {
        var app = this.app;
        this.app.on("ready", function() {
            expect(app.method1).to.be.a("function");
            expect(app.method2).to.be.a("function");
            done();
        });
    });

});
