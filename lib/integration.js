"use strict";

var uuid = require("uuid");

var _callId = 0;

function _genCallId() {
    _callId += 1;
    return _callId;
}

module.exports = function(params) {
    params = params || {};
    var channel = uuid.v4();
    var _calls = {};
    var _eventCb = {};
    var _ready = false;

    function WanadevProjectItegration() {
        this.iframe = _generateIframe();
    }

    WanadevProjectItegration.prototype = {
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

        var url = params.appUrl + "#chan=" + channel + "&config=" + btoa(JSON.stringify(params.config || {})).replace(/=+$/, "");
        iframe.src = url;

        var htmlNode = params.htmlNode;
        if (typeof htmlNode == "string") {
            htmlNode = document.querySelector(htmlNode);
        }
        htmlNode.appendChild(iframe);

        return iframe;
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

            "push-method": function(params) {
                // TODO
            },

            "remote-method-response": function(params) {
                if (!params.callId || !_calls[params.callId]) {
                    return;
                }
                _calls[params.callId](params.error || null, params.response);
                delete _calls[params.callId];
            },

            "event": function(params) {
                if (_eventCb[params.name]) {
                    _eventCb[params.name].apply(integration, params.args || []);
                }
            }
        };

        if (handlers[event.data.action]) {
            handlers[event.data.action](event.data);
        }
    }

    function _sendMessage(action, params) {
        params = params || {};
        params.action = action;
        params.chan = channel;
        integration.iframe.contentWindow.postMessage(params, "*");
    }

    if (!params.htmlNode) {
        throw new Error("MissingHtmlNodeParam");
    }
    if (!params.appUrl) {
        throw new Error("MissingAppUrlParam");
    }

    var integration = new WanadevProjectItegration();

    addEventListener("message", _onMessage, false);

    return integration;
};
