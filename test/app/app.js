"use strict";

var Q = require("q");
var WanadevProjectApi = require("../../lib/WanadevProjectApi.js");

var Api = WanadevProjectApi.$extend({

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
    }
});

var api = new Api();

api.addApiMethod("method2", function() {});

api.ready();
