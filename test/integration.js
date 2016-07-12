"use strict";

var APP_URL = location.protocol + "//" + location.hostname + ":3011";

var expect = require("expect.js");
var ObsidianApp = require("../lib/integration.js");

describe("Integration", function() {

    before(function() {
        this.app = ObsidianApp({
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

    it("can register callback to events", function(done) {
        this.app.on("hello", function(param1, param2) {
            expect(param1).to.equal("world");
            expect(param2).to.equal(42);
            done();
        });
        this.app.sendMeAnEvent("hello", "world", 42);
    });

    it("can transfer an Uint8Array", function() {
        var array = new Uint8Array([0, 1, 2]);
        return this.app.echo(array)
            .then(function(a) {
                expect(a).to.be.a(Uint8Array);
                expect(a[0]).to.equal(0);
                expect(a[1]).to.equal(1);
                expect(a[2]).to.equal(2);
            });
    });

    it("can transfer an Float", function() {
        var array = new Float32Array([1.5]);
        return this.app.echo(array)
            .then(function(a) {
                expect(a).to.be.a(Float32Array);
                expect(a[0]).to.equal(1.5);
            });
    });

    it("can transfer a Node.js Buffer", function() {
        var buffer = new Buffer("FOOBAR");
        return this.app.echo(buffer)
            .then(function(buff) {
                expect(buff).to.be.a(Buffer);
                expect(buff.toString("ascii", 1, 3)).to.equal("OO");
                expect(buff.readUInt8).to.be.a("function");
            });
    });

});
