# Obsidian API

This module provides a way to implement integration API (to communicate between the integration page and the application iframe).

Features:

* Remote method calls with response (integration -> app -> integration)
* Provides callback-based events (app -> integration)
* Allows the integration to send configuration to the app
* Allows to transfer of various types of objects (including `TypedArrays`, ~~`Blob`~~ and ~~`Buffer`~~ TODO)
* Allows to use both node-like callbacks or promises for async calls


## App-side example

```javascript
"use strict";

var ObsidianApi = require("obsidian-api");


var MyApi = ObsidianApi.$extend({

    simpleMethod: function(a, b) {
        "@api";                                                   // allows to call this method from the integration side
        if (typeof a != "number" || typeof b != "number") {
            throw new Error("NotANumber");
        }
        return a + b;                                             // return of a simple result (will be passed as return
                                                                  // value to the integration-side caller)
    },

    asyncMethodUsingCallback: function(a, b, callback) {          // callback = function(error, result) {}
        "@api";
        if (typeof a != "number" || typeof b != "number") {
            callback(new Error("NotANumber"));
        } else {
            callback(null, a + b);                                // null as first param means "no error"
        }
    },

    asyncMethodUsingPromise: function(a, b) {
        "@api";
        var promise = sommeFunctionThatReturnsAPromise(a, b);
        return promise;                                           // by returning a promise, the API will wait for the promise
                                                                  // to be resolved and then return the result to the integration
    }
});


// Get the configuration provided by the integration
var config = MyApi.$getConfig();


// Instanciate the API
var api = new MyApi();


// Hot plug of new API methods (allows components to dynamicaly extend the API)
api.addApiMethod("myMethod", function() {});


// Tells the integration that the app is ready
api.ready();


// Send an event to the integration
api.sendEvent("eventName", "param1", "param2");
```


## Integration-side example

```javascript
// Start the application
var app = obsidianApp({
    htmlNode: "#integration-div",              // Query selector or HTMLElement that will be the parent of the iframe
    appUrl: "http://example.com/",             // The URL of the application
    config: {}                                 // Optional config that will be passed to the application
});


// Do stuff when the application is ready
app.on("ready", function() {

    // Call remote methods (using node-like callbacks to get the response)

    app.simpleMethod(1, 2, function(error, result) {
        console.log(result);   // -> 3
    });

    app.asyncMethodUsingCallback(1, 2, function(error, result) {
        console.log(result);   // -> 3
    });

    // Call a remote method using promises to get the result

    app.simpleMethod(1, 2)
        .then(function(result) {
            console.log(result);  // -> 3
        })
        .catch(function(error) {
            console.error(error);
        });
});


// Register a callback to an API event
app.on("eventName", function(param1, param2) {
    // do stuff here...
});
```
