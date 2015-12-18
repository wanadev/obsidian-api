"use strict";

var expect = require("expect.js");
var WanadevProjectApi = require("../lib/WanadevProjectApi.js");

describe("WanadevProjectApi", function() {

    describe("$getConfig", function() {

        before(function() {
            this.config = {
                components: ["SocialComponent", "FooComponent"],
                displayName: "FooApp",
                lang: "fr_FR"
            };
            window.location.hash = "#chan=85e701e9-a390-4c16-bd5f-95623c45b2fb&config=" + btoa(JSON.stringify(this.config));
        });

        it("can retreive config", function() {
            expect(WanadevProjectApi.$getConfig()).to.eql(this.config);
        });

    });
});
