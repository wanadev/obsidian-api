"use strict";

var _ = require("lodash");

module.exports = {
    parseUrlParams: function(url) {
        var params = {};

        if (_(url).includes("#")) {
            url = url.split("#")[1];
        }

        var kvPair = url.split("&");

        for (var i = 0 ; i < kvPair.length ; i++) {
            if (kvPair[i].length === 0) {
                continue;
            }
            if (!_(kvPair[i]).includes("=")) {
                params[kvPair[i]] = null;
                continue;
            }
            var kvSplit = kvPair[i].split("=");
            if (kvSplit.length == 2) {
                params[kvSplit[0]] = kvSplit[1];
            }
        }

        return params;
    }
};
