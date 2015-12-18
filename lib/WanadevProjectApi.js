"use strict";

var Class = require("abitbol");

var helpers = require("./helpers.js");

var WanadevProjectApi = Class.$extend({

    __init__: function() {
        this.$data.channel = "";
        var urlParams = helpers.parseUrlParams(window.location.hash);
        if (urlParams.chan) {
            this.$data.channel = urlParams.chan;
        }
    },

    __classvars__: {
        "$getConfig": function() {
            var urlParams = helpers.parseUrlParams(window.location.hash);
            if (urlParams.config) {
                try {
                    return JSON.parse(atob(urlParams.config));
                } catch (error) {
                    // pass
                }
            }
            return {};
        }
    }

});

module.exports = WanadevProjectApi;
