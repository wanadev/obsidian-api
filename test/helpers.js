"use strict";

var expect = require("expect.js");
var helpers = require("../lib/helpers.js");

describe("heleprs", function() {

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
});
