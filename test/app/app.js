"use strict";

var Q = require("q");
var ObsidianApi = require("../../lib/ObsidianApi.js");

var Api = ObsidianApi.$extend({

    method1: function() {
        "@api";
    },

    addSyncOk: function(a, b) {
        "@api";
        return a + b;
    },

    addSyncError: function(a, b) {
        "@api";
        throw new Error("TestError");
    },

    addAsyncCallbackOk: function(a, b, callback) {
        "@api";
        setTimeout(function() {
            callback(null, a + b);
        }, 1);
    },

    addAsyncCallbackError: function(a, b, callback) {
        "@api";
        setTimeout(function() {
            callback(new Error("TestError"));
        }, 1);
    },

    addAsyncPromiseOk: function(a, b) {
        "@api";
        return Q.Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve(a + b);
            }, 1);
        });
    },

    addAsyncPromiseError: function(a, b) {
        "@api";
        return Q.Promise(function(resolve, reject) {
            setTimeout(function() {
                reject(new Error("TestError"));
            }, 1);
        });
    },

    sendMeAnEvent: function(eventName, param1, param2) {
        "@api";
        this.sendEvent(eventName, param1, param2);
    },

    echo: function(data) {
        "@api";
        return data;
    }
});

var api = new Api();

api.addApiMethod("method2", function() {});

api.ready();
