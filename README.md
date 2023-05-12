# Obsidian API

[![Lint and test](https://github.com/wanadev/obsidian-api/actions/workflows/tests.yml/badge.svg)](https://github.com/wanadev/obsidian-api/actions/workflows/tests.yml)
[![NPM Version](http://img.shields.io/npm/v/obsidian-api.svg?style=flat)](https://www.npmjs.com/package/obsidian-api)
[![License](http://img.shields.io/npm/l/obsidian-api.svg?style=flat)](https://github.com/wanadev/obsidian-api/blob/master/LICENSE)
[![Discord](https://img.shields.io/badge/chat-Discord-8c9eff?logo=discord&logoColor=ffffff)](https://discord.gg/BmUkEdMuFp)

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


## Install

    npm install obsidian-api


## Documentation

Documentation and examples:

* https://wanadev.github.io/obsidian-api/


## Contributing

### Questions

If you have any question, you can:

* [Open an issue on GitHub][gh-issue]
* [Ask on discord][discord]

### Bugs

If you found a bug, please [open an issue on Github][gh-issue] with as much information as possible.

### Pull Requests

Please consider [filing a bug][gh-issue] before starting to work on a new feature. This will allow us to discuss the best way to do it. This is of course not necessary if you just want to fix some typo or small errors in the code.

### Coding Style / Lint

To check coding style, run the follwoing command:

    npx grunt jshint

### Tests

Tu run tests, use the following command:

    npx grunt test


[gh-issue]: https://github.com/wanadev/obsidian-api/issues
[discord]: https://discord.gg/BmUkEdMuFp


## Changelog

* **[NEXT]** (changes on master that have not been released yet):

  * Updated dependencies (@jbghoul, #31)
  * Replaced deprecated mocha-phantomjs by mocha-headless-chrome to run tests (@jbghoul, #31)

* **1.0.8:**

  * Import only used lodash functions instead of the whole library (#30)

* **1.0.7**:

  * Fixes Error unserialization

* **1.0.6:**

  * Fixes issue when API functions return `null` (#17)

* **1.0.5:**

  * Updates dependencies

* **1.0.4:**

  * Documentation

* **1.0.3:**

  * Updates dependencies

* **1.0.2:**

  * Fixes Node.js Buffer transfer

* **1.0.1:**

  * Updates dependencies

* **1.0.0:**

  * First public release
