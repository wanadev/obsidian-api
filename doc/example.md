---
title: Example
autotoc: true
menuOrder: 3
---

# Obsidian API Example

Here is a complete example that shows interaction between the application and
its integration through the API.


## Application-Side Javascript

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


## Integration-side Javascript

```javascript
var obsidianApp = require("obsidian-api/lib/integration");

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

__NOTE:__ If your are not using Browserify on the integration-side, you can
also use the pre-built version of the integration script available here:

* https://raw.githubusercontent.com/wanadev/obsidian-api/master/dist/integration.js

**Example using the pre-built integration script:**

```html
<div id="integration-div"></div>
<script src="./js/integration.js"></script>
<script>
    var app = obsidianApp({
        htmlNode: "#integration-div",
        appUrl: "http://example.com/",
        config: {}
    });

    ...
</script>
```
