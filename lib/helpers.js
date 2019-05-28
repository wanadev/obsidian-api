"use strict";

var _ = require("lodash");

module.exports = {
    parseUrlParams: function(url) {
        var params = {};

        if (_(url).includes("#")) {
            url = url.split("#")[1];
        }

        var kvPair = url.split("&");

        for (var i = 0 ; i < kvPair.length ; i++) {
            if (kvPair[i].length === 0) {
                continue;
            }
            if (!_(kvPair[i]).includes("=")) {
                params[kvPair[i]] = null;
                continue;
            }
            var kvSplit = kvPair[i].split("=");
            if (kvSplit.length == 2) {
                params[kvSplit[0]] = kvSplit[1];
            }
        }

        return params;
    },

    // Cherry-picked from Threadify <https://github.com/flozz/threadify/blob/029aca5bffcf3c2c352cf601d53f7bd812a8c027/src/helpers.js#L3>
    // Copyright (c) 2015, Fabien LOISON <http://www.flozz.fr/>
    // License BSD-3-Clause
    serializeArgs: function (args) {
        var typedArray = [
            "Int8Array",
            "Uint8Array",
            "Uint8ClampedArray",
            "Int16Array",
            "Uint16Array",
            "Int32Array",
            "Uint32Array",
            "Float32Array",
            "Float64Array"
        ];
        var serializedArgs = [];
        var transferable = [];

        for (var i = 0 ; i < args.length ; i++) {
            if (args[i] instanceof Error) {
                var obj = {
                    type: "Error",
                    value: {
                        name: args[i].name,
                        message: args[i].message,
                        stack: args[i].stack
                    }
                };
                serializedArgs.push(obj);
            } else if (args[i] instanceof DataView) {
                transferable.push(args[i].buffer);
                serializedArgs.push({
                    type: "DataView",
                    value: args[i].buffer
                });
            } else if (args[i] && typeof args[i] == "object" && typeof args[i].readUInt8 == "function") {  // Node Buffer
                var arrayBuffer = args[i].buffer;
                transferable.push(arrayBuffer);
                serializedArgs.push({
                    type: "Buffer",
                    value: arrayBuffer
                });
            } else {
                // transferable: ArrayBuffer
                if (args[i] instanceof ArrayBuffer) {
                    transferable.push(args[i]);

                // tranferable: ImageData
                } else if (args[i] instanceof ImageData) {
                    transferable.push(args[i].data.buffer);

                // tranferable: TypedArray
                } else {
                    for (var t = 0 ; t < typedArray.length ; t++) {
                        if (args[i] instanceof global[typedArray[t]]) {
                            transferable.push(args[i].buffer);
                            break;
                        }
                    }
                }

                serializedArgs.push({
                    type: "arg",
                    value: args[i]
                });
            }
        }

        return {
            args: serializedArgs,
            transferable: transferable
        };
    },

    // Cherry-picked from Threadify <https://github.com/flozz/threadify/blob/029aca5bffcf3c2c352cf601d53f7bd812a8c027/src/helpers.js#L69>
    // Copyright (c) 2015, Fabien LOISON <http://www.flozz.fr/>
    // License BSD-3-Clause
    unserializeArgs: function (serializedArgs) {
        var args = [];

        for (var i = 0 ; i < serializedArgs.length ; i++) {

            switch (serializedArgs[i].type) {
                case "arg":
                    args.push(serializedArgs[i].value);
                    break;
                case "Error":
                    var obj = new Error();
                    for (var key in serializedArgs[i].value) {
                        try {
                            obj[key] = serializedArgs[i].value[key];
                        } catch(error) {
                            // pass
                        }
                    }
                    args.push(obj);
                    break;
                case "DataView":
                    args.push(new DataView(serializedArgs[i].value));
                    break;
                case "Buffer":
                    args.push(new Buffer(serializedArgs[i].value));
            }
        }

        return args;
    }

};
