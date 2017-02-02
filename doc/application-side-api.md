---
title: Application-Side API
autotoc: true
menuOrder: 1
---

# Application-Side API

## Implementing an Obsidian API In a Web Application

To implement an Obsidian API in your application, you have to extend the
`ObsidianApi` class provided by the `obsidian-api` [npm package][npm-package]:

```javascript
// Import the class (Node-like require if you are using Browserify, otherwise you
// have to include the obsidian-api.js script in your web page).
var ObsidianApi = require("obsidian-api");

// Extending the ObsidianApi Class
var MyApi = ObsidianApi.$extend({

    // ... API methods will go there

});
```

__NOTE:__ `ObsidianApi` is implemented using [Abitbol classes][abitbol].

To start the API, we only have to instantiate its class:

```javascript
var api = new MyApi();
```

The last thing is to tell the integration that the application is fully loaded
and ready to respond to API calls:

```javascript
api.ready();
```

## Methods

There are two ways to add methods to the API:

* Implementing the method in our API class,
* Dynamically adding the method at run-time.

### Adding Methods To The API Class

To implement an API method in our API class, we only have to add a method with
the `"@api"` [annotation][] to the class:

```javascript
var MyApi = ObsidianApi.$extend({

    myApiMethod: function(a, b) {
        "@api";
        return a + b;  // this will be returned to the integration-side caller
    },

    // ...

});
```

If an error is thrown in your method, it will be sent to the integration-side
caller:

```javascript
var MyApi = ObsidianApi.$extend({

    myApiMethod: function(a, b) {
        "@api";  // <- this annotation is required to make an API method
        throw new Error("NotImplementedError");  // This error will be sent
                                                 // to the integration
    },

    // ...

});
```

### Adding Methods Dynamically At Run-Time

Obsidian API allows you to dynamically add new API methods at run-time:

```javascript
api.addApiMethod("myApiMethod", function(a, b) {
    return a + b;
});
```

### Handling Asynchronous Calls

There are two ways to implement asynchronous API methods with Obsidian API:

* You can use [Node-like callbacks][node-cb],
* or you can use [promises][].

__NOTE:__ whatever you choose, using a callback or promise in your API method,
the integration-side caller will still be able to use both to get the method's
return value: so if you use the "callback way" in your application-side method,
the integration script can use a promise OR a callback depending on what its
developer prefers.

#### Using Node-Like Callbacks

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

To send an error to the callback, just pass the error as the first parameter:

```javascript
callback(new Error("FooError"));
```

To send a result to the callback, pass `null` to the first parameter and your
result as the second parameter:

```javascript
callback(null, "my result");
```

To use a callback for your API method, just add a `callback` parameter to your
function, and call the callback that Obsidian API will give you with the right
parameters as described above:

```javascript
var MyApi = ObsidianApi.$extend({

    myApiMethod: function(a, b, callback) {
        "@api";

        someAsynchronousFunction(a, b, function(error, result) {
            if (error) {
                callback(error);
            } else {
                callback(null, result);  // null as first param means "no error"
            }
        });

        // Note that this method MUST return NOTHING except "undefined"
    },

    // ...

});
```

#### Using Promises

To use promises in your API method, you only have to return your promise,
Obsidian API will wait for the promise to be resolved (or rejected) to return
the result to the integration-side caller:

```javascript
var MyApi = ObsidianApi.$extend({

    myApiMethod: function(a, b) {
        "@api";

        return someAsynchronousFunctionThatReturnsAPromise(a, b);
    },

    // ...

});
```


## Events

The application-side API can send events to the integration. This can be
done with this simple line of code:

```javascript
api.sendEvent("eventName", "param1", "param2", ...);
```


## Configuration

The integration can send a configuration object to the application before it was
initialized (parameters are passed through the `iframe` URL). To get the
configuration, just call the `$getConfig()` static method of the `ObsidianApi`
class:

```javascript
var config = MyApi.$getConfig();  // -> {}
```

## Complete Example:

You can find a more complete example that contains both application-side and
integration-side code [here](./example.html).


[npm-package]: https://www.npmjs.com/package/obsidian-api
[abitbol]: https://wanadev.github.io/abitbol/
[annotation]: https://wanadev.github.io/abitbol/using-abitbol.html#annotations
[node-cb]: http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/
[promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
