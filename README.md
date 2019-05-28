# Obsidian API

[![Build Status](https://travis-ci.org/wanadev/obsidian-api.svg?branch=master)](https://travis-ci.org/wanadev/obsidian-api)
[![NPM Version](http://img.shields.io/npm/v/obsidian-api.svg?style=flat)](https://www.npmjs.com/package/obsidian-api)
[![License](http://img.shields.io/npm/l/obsidian-api.svg?style=flat)](https://github.com/wanadev/obsidian-api/blob/master/LICENSE)
[![Dependencies](https://img.shields.io/david/wanadev/obsidian-api.svg?maxAge=2592000)]()
[![Dev Dependencies](https://img.shields.io/david/dev/wanadev/obsidian-api.svg?maxAge=2592000)]()
[![Greenkeeper badge](https://badges.greenkeeper.io/wanadev/obsidian-api.svg)](https://greenkeeper.io/)

**Obsidian API** is a library that allows you to implement an API between a web
application running in an `iframe` and the web page that integrates it.

**Obsidian API is composed of two parts:**

* An application-side Class (inside the `iframe`) that will be used to
  implement the API (methods that will be called remotely by the
  integration,...),
* and an integration-side script (outside the `iframe`) that will be used as
  a client for the API. This script is completely generic and can be used to
  connect to any web application that implements an Obsidian API.

**Features:**

* Remote method calls with return value (integration → app → integration),
* Provides callback-based events (app → integration),
* Allows the integration to send some configuration to the application before
  it is loaded,
* Allows to transfer various types of objects (including `TypedArrays`,
  `Blob` and `Buffer`),
* Allows to use both node-like callbacks or promises for asynchronous calls.

![Obsidian API Schema](./doc/images/obsidian-api-schema.png)


## Documentation

Documentation and examples:

* https://wanadev.github.io/obsidian-api/


## Changelog

* **1.0.7**: Fixes Error unserialization
* **1.0.6:** Fixes issue when API functions return `null` (#17)
* **1.0.5:** Updates dependencies
* **1.0.4:** Documentation
* **1.0.3:** Updates dependencies
* **1.0.2:** Fixes Node.js Buffer transfer
* **1.0.1:** Updates dependencies
* **1.0.0:** First public release
