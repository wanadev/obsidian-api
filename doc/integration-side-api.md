---
title: Integration-Side API
autotoc: true
menuOrder: 2
---

# Integration-Side API

## Integrating an Obsidian Web Application

Obsidian Applications are integrated in a web page using an `<iframe/>` that
will be automatically created by the integration script.

The first thing to do is to add an element in the page that will contain this
iframe:

```html
<div id="obsidian-app"></div>
```

The you have to include the integration script. If you are using
[Browserify][], you can `require` the script from the `obsdian-api` [npm
package][npm-package]:

```javascript
var obsidianApp = require("obsidian-api/lib/integration");
```

Else you can include the [static build of the integration script][inte-script]
in your HTML page:

```html
<script src="js/integration.js"></script>
```

__NOTE:__ The integration script is the same whatever the Obsidian Application
you integrates, it is completely generic: the application will push its API
into your integration through this script.

Finally the minimal code to start the application is the following:

```javascript
var app = obsidianApp({
    htmlNode: "#obsidian-app",
    appUrl: "http://myapp.example.com/"
});
```

Where:

* `htmlNode` is the HTMLElement (or a query selector that match the element)
  where the `iframe` will be created,
* `appUrl` is the root URL of the application.

That's it.


## Listen to API Events

Before we start talking about API methods, we have to speak about API Events.
Obsidian Application are able to send event, with or without parameters, to the
integration.

Listening to those events is easy:

```javascript
app.on("eventName", function(param1, param2) {
    // ...
});
```

### The "ready" event

Each Obsidian Application have there own set of events, **but** there is one
standard event that **every** application will always call: the `ready` event.

This event is called when the application is fully loaded and the API is ready
to answer requests. So you will have to wait for this event before querying the
API:

```javascript
api.on("ready", function() {
    // You can now call API methods here.
});
```


## Calling API Methods

### Simple Method Call

Calling an API method without getting any result nor handling errors is quite
simple:

```javascript
api.myApiMethod("param1", "param2");
```

__NOTE:__ No methods should be called before receiving the `ready` event from
the API.

### Getting Return Value / Handling Errors

Obsidian API method calls are asynchronous. So to get result or handle errors we
have two choices:

* using [Node-like callbacks][node-cb],
* or using [promises][].

#### Using Callbacks

What we call Node-like callbacks here are callbacks that can take up to two
parameters:

* an `error` parameter first,
* and an optional `result` parameter next.

So a classic Node-like callback looks like this:

```javascript
function callback(error, result) {
    // ...
}
```

To use callbacks to get the method result or handling errors, just pass the
callback function after the method's parameters:


```javascript
api.myApiMethod("param2", "param2", function(error, result) {
    if (error) {
        // Handle error here...
    } else {
        // Use the result here...
    }
});
```

#### Using Promises

Obsidian API allows you to use promise instead of callback to handle the
methods result and to handle results:

```javascript
api.myApiMethod("param1", "param2")
    .then(function(result) {
        // Use the result here...
    })
    .catch(function(error) {
        // Handle error here...
    })
    .done();  // Always finish the promise chain with .done()
              // to let the uncaught error be thrown.
```


## Sending Configuration To The Application

Finally, you can send a configuration object to the application when you
declare it:

```javascript
var app = obsidianApp({
    htmlNode: "#obsidian-app",
    appUrl: "http://myapp.example.com/",
    config: {
        option: "value",
        lang: "fr_FR",
        // ...
    }
});
```

## Complete Example:

You can find a more complete example that contain both application-side and
integration-side code [here](./example.html).


[Browserify]: http://browserify.org/
[npm-package]: https://www.npmjs.com/package/obsidian-api
[inte-script]: https://raw.githubusercontent.com/wanadev/obsidian-api/master/dist/integration.js
[node-cb]: http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/
[promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
