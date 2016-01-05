"use strict";

var Class = require("abitbol");
var _ = require("lodash");

var helpers = require("./helpers.js");

var _apiMethods = {};

var WanadevProjectApi = Class.$extend({

    __init__: function() {
        this.$data.channel = "";
        var urlParams = helpers.parseUrlParams(window.location.hash);
        if (urlParams.chan) {
            this.$data.channel = urlParams.chan;
        }
        for (var method in this.$map.methods) {
            if (!this.$map.methods[method].annotations.api) {
                continue;
            }
            _apiMethods[method] = this[method];
        }
        this._sendMessage("push-methods", {names: _.keys(_apiMethods)});
    },

    ready: function() {
        this._sendMessage("app-ready");
    },

    addApiMethod: function(name, callback) {
        _apiMethods[name] = callback;
        this._sendMessage("push-methods", {names: [name]});
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
