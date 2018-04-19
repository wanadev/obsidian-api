"use strict";

if (!ArrayBuffer["isView"]) {
    ArrayBuffer.isView = function(a) {
        return a !== null && typeof(a) === "object" && a["buffer"] instanceof ArrayBuffer;
    };
}
