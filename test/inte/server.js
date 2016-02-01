"use strict";

var express = require("express");
var serveStatic = require("serve-static");

var PORT = process.env.PORT || 3010;

var app = express();

app.use("/", serveStatic(__dirname));

console.log("Starting Obsidian Api Test Server [inte] on 0.0.0.0:" + PORT);
app.listen(PORT);
