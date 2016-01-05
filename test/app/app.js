"use strict";

var WanadevProjectApi = require("../../lib/WanadevProjectApi.js");

var Api = WanadevProjectApi.$extend({

    method1: function() {
        "@api";
    }

});

var api = new Api();

api.addApiMethod("method2", function() {});

api.ready();
