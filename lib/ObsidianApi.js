"use strict";

var Class = require("abitbol");
var isFunction = require("lodash/isFunction");

var helpers = require("./helpers.js");

var _apiMethods = {};

var ObsidianApi = Class.$extend({

    __init__: function() {
        this.$data.channel = "";
        var urlParams = helpers.parseUrlParams(window.location.hash);
        if (urlParams.chan) {
            this.$data.channel = urlParams.chan;
        }

        window.addEventListener("message", this._onMessage, false);

        for (var method in this.$map.methods) {
            if (!this.$map.methods[method].annotations.api) {
                continue;
            }
            _apiMethods[method] = this[method];
        }
        this._sendMessage("push-methods", {names: Object.keys(_apiMethods)});
    },

    ready: function() {
        this._sendMessage("app-ready");
    },

    addApiMethod: function(name, callback) {
        _apiMethods[name] = callback;
        this._sendMessage("push-methods", {names: [name]});
    },

    sendEvent: function(eventName /*, *args */) {
        var sargs = helpers.serializeArgs(Array.from(arguments).slice(1));
        this._sendMessage("event", {name: eventName, args: sargs.args}, sargs.transferable);
    },

    _onMessage: function(event) {
        if (!event.data || !event.data.action || event.data.chan != this.$data.channel) {
            return;
        }

        var this_ = this;

        var handlers = {
            "remote-method-call": function(params) {
                if (!params.callId || !params.name || !params.args) {
                    return;
                }

                function _sendResponse(error, response) {
                    var serror = helpers.serializeArgs([error]);
                    var sresponse = helpers.serializeArgs([response]);
                    this_._sendMessage("remote-method-response", {
                        callId: params.callId,
                        error: serror.args,
                        response: sresponse.args
                    }, Array.prototype.concat(serror.transferable, sresponse.transferable));
                }

                var args = helpers.unserializeArgs(params.args);
                args.push(_sendResponse);

                var result;
                var error = null;

                try {
                    result = _apiMethods[params.name].apply(null, args);
                } catch (e) {
                    error = e;
                }

                // Promise
                if (result && typeof result == "object" && isFunction(result.then)) {
                    result.then(
                        function(value) {
                            _sendResponse(null, value);
                        },

                        function(error) {
                            _sendResponse(error);
                        }
                    );
                }
                // Synchrone response
                else if (result !== undefined || error !== null) {
                    _sendResponse(error, result);
                }
            }
        };

        if (handlers[event.data.action]) {
            handlers[event.data.action](event.data);
        }
    },

    _sendMessage: function(action, params, transferable) {
        params = params || {};
        transferable = transferable || [];
        params.action = action;
        params.chan = this.$data.channel;
        window.parent.postMessage(params, "*", transferable);
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

module.exports = ObsidianApi;
