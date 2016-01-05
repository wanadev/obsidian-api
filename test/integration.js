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

    it("can call a remote method that returns a result", function(done) {
        var app = this.app;
        this.app.on("ready", function() {
            app.addSyncOk(1, 2, function(error, result) {
                expect(error).to.be(null);
                expect(result).to.be(3);
                done();
            });
        });
    });

    it("can call a remote method that returns an error", function(done) {
        var app = this.app;
        this.app.on("ready", function() {
            app.addSyncError(1, 2, function(error, result) {
                expect(error).to.be.an(Error);
                expect(error.toString()).to.match(/TestError/);
                expect(result).to.be(undefined);
                done();
            });
        });
    });

    it("can call remote methods that return a result (using promises)", function() {
        var app = this.app;
        return app.addSyncOk(1, 2)
            .then(function(result) {
                expect(result).to.equal(3);
            })

            .then(function() {
                return app.addAsyncCallbackOk(1, 2);
            })
            .then(function(result) {
                expect(result).to.equal(3);
            })

            .then(function() {
                return app.addAsyncPromiseOk(1, 2);
            })
            .then(function(result) {
                expect(result).to.equal(3);
            });
    });

    it("can call remote methods that return an error (using promises)", function() {
        var app = this.app;
        return app.addSyncError(1, 2)
            .then(function() {
                throw new Error("ShouldNotSucceed");
            })
            .catch(function(error) {
                expect(error).to.be.an(Error);
                expect(error.toString()).to.match(/TestError/);
            })

            .then(function() {
                return app.addAsyncCallbackError(1, 2);
            })
            .then(function() {
                throw new Error("ShouldNotSucceed");
            })
            .catch(function(error) {
                expect(error).to.be.an(Error);
                expect(error.toString()).to.match(/TestError/);
            })


            .then(function() {
                return app.addAsyncPromiseError(1, 2);
            })
            .then(function() {
                throw new Error("ShouldNotSucceed");
            })
            .catch(function(error) {
                expect(error).to.be.an(Error);
                expect(error.toString()).to.match(/TestError/);
            });
    });

});
