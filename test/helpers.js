"use strict";

var expect = require("expect.js");
var helpers = require("../lib/helpers.js");

describe("helpers", function() {

    describe("parseUrlParams", function() {

        it("can parse params", function() {
            expect(helpers.parseUrlParams("")).to.eql({});
            expect(helpers.parseUrlParams("#")).to.eql({});
            expect(helpers.parseUrlParams("http://example.com/#")).to.eql({});

            expect(helpers.parseUrlParams("a")).to.eql({a: null});
            expect(helpers.parseUrlParams("#a")).to.eql({a: null});
            expect(helpers.parseUrlParams("http://example.com/#a")).to.eql({a: null});

            expect(helpers.parseUrlParams("#foo=bar")).to.eql({foo: "bar"});
            expect(helpers.parseUrlParams("#foo=bar&baz=foobar")).to.eql({foo: "bar", baz: "foobar"});
        });

    });

    describe("uuid4", function() {

        it("can generates an UUID v4 (random)", function() {
            expect(helpers.uuid4()).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
    });

    describe("fallbackUuid4", function() {

        it("can generates an UUID v4 (random)", function() {
            expect(helpers.fallbackUuid4()).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
        });
    });

});
