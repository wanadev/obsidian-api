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

    _onMessage: function(event) {
        if (!event.data || !event.data.action || event.data.chan != this.$data.channel) {
            return;
        }
        // TODO
    },

    _sendMessage: function(action, params) {
        params = params || {};
        params.action = action;
        params.chan = this.$data.channel;
        window.parent.postMessage(params, "*");
    },

    __classvars__: {
        $getConfig: function() {
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
