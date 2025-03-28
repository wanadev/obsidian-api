"use strict";

var isFunction = require("lodash/isFunction");

var helpers = require("./helpers.js");

var _callId = 0;

function _genCallId() {
    _callId += 1;
    return _callId;
}

module.exports = function(params) {
    params = params || {};
    var channel = helpers.uuid4();
    var integration = null;
    var _calls = {};
    var _eventCb = {};
    var _ready = false;

    function ObsidianProjectItegration() {
        this.iframe = _generateIframe();
    }

    ObsidianProjectItegration.prototype = {
        on: function(eventName, callback) {
            if (eventName == "ready" && _ready) {
                callback();
                return;
            }
            _eventCb[eventName] = callback;
        }
    };

    function _generateIframe() {
        var iframe = document.createElement("iframe");

        iframe.style.width = params.width || "100%";
        iframe.style.height = params.height || "100%";
        iframe.style.border = "none";
        iframe.frameborder = "0";
        iframe.scrolling = "no";

        if (params.iframeAttributes) {
            for (var attr in params.iframeAttributes) {
                iframe.setAttribute(attr, params.iframeAttributes[attr]);
            }
        }

        var url = params.appUrl + "#chan=" + channel + "&config=" + btoa(JSON.stringify(params.config || {})).replace(/=+$/, "");
        iframe.src = url;

        var htmlNode = params.htmlNode;
        if (typeof htmlNode == "string") {
            htmlNode = document.querySelector(htmlNode);
        }
        htmlNode.appendChild(iframe);

        return iframe;
    }

    function nodeify(promise, callback) {
        if (!isFunction(callback)) {
            return;
        }

        promise.then(function(value) {
            callback(null, value);
        }, function(error) {
            callback(error);
        });
    }

    function _addRemoteMethod(name) {
        integration[name] = function() {
            var callId = _genCallId();
            var args = Array.from(arguments);
            var callback;

            if (isFunction(args[args.length-1])) {
                callback = args.pop();
            }

            var promise = new Promise(function(resolve, reject) {
                _calls[callId] = function(error, response) {
                    delete _calls[callId];
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                };
            });
            nodeify(promise, callback);

            var sargs = helpers.serializeArgs(args);
            _sendMessage("remote-method-call", {
                callId: callId,
                name: name,
                args: sargs.args
            }, sargs.transferable);

            return promise;
        };
    }

    function _onMessage(event) {
        if (!event.data || !event.data.action || event.data.chan != channel) {
            return;
        }

        var handlers = {
            "app-ready": function(params) {
                _ready = true;
                if (_eventCb.ready) {
                    _eventCb.ready();
                    delete _eventCb.ready;
                }
            },

            "push-methods": function(params) {
                if (!params.names) {
                    return;
                }
                for (var i = 0 ; i < params.names.length ; i++) {
                    _addRemoteMethod(params.names[i]);
                }
            },

            "remote-method-response": function(params) {
                if (!params.callId || !_calls[params.callId]) {
                    return;
                }
                var error = helpers.unserializeArgs(params.error)[0] || null;
                var response = helpers.unserializeArgs(params.response)[0];
                _calls[params.callId](error, response);
                delete _calls[params.callId];
            },

            "event": function(params) {
                if (_eventCb[params.name]) {
                    _eventCb[params.name].apply(integration, helpers.unserializeArgs(params.args) || []);
                }
            }
        };

        if (handlers[event.data.action]) {
            handlers[event.data.action](event.data);
        }
    }

    function _sendMessage(action, params, transferable) {
        params = params || {};
        transferable = transferable || [];
        params.action = action;
        params.chan = channel;
        integration.iframe.contentWindow.postMessage(params, "*", transferable);
    }

    if (!params.htmlNode) {
        throw new Error("MissingHtmlNodeParam");
    }
    if (!params.appUrl) {
        throw new Error("MissingAppUrlParam");
    }

    integration = new ObsidianProjectItegration();

    addEventListener("message", _onMessage, false);

    return integration;
};
