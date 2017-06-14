# 🌲 Timber - Simple Ruby Structured Logging

[![CircleCI](https://circleci.com/gh/timberio/timber-node.svg?style=svg)](https://circleci.com/gh/timberio/timber-node)
[![Coverage Status](https://coveralls.io/repos/github/timberio/timber-node/badge.svg?branch=master)](https://coveralls.io/github/timberio/timber-node?branch=master)
[![npm version](https://badge.fury.io/js/timber.svg)](https://badge.fury.io/js/timber)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

* [Timber website](https://timber.io)
* [Timber docs](https://timber.io/docs)
* [Library docs](https://timberio.github.io/timber-node/)
* [Support](mailto:support@timber.io)


## Installation

Use `npm` or `yarn` to install Timber on your project:

```bash
npm install --save timber
```
```bash
yarn add timber
```

## Usage

```
var timber = require('timber');
timber.install(new timber.transports.HTTPS('your-api-key'));
```

## npm scripts

`watch` - starts file watcher

`lint` - runs eslint on `/src`

`test` - runs tests and formats piped output with Jest.

`build` - compiles src files into the dist folder, consumable by npm.

## Publishing
When you are ready to publish a new version of your module, the following steps can be used:
  1. add and commit your changes via git
  2. `npm version patch -m "Ugrade message..."`
  3. `npm publish`

If publish is a success, the `postpublish` npm script will run `git push origin master --follow-tags`, pushing up and tagging your code properly.

If you run `npm version patch` before committing your changes, you'll get a message like `npm ERR! Git working directory not clean.`. Commit and retry.

## Timber Specific
# :evergreen_tree: Timber - Master your Node apps with structured logging

<p align="center" style="background: #140f2a;">
<a href="http://github.com/timberio/timber-elixir"><img src="http://files.timber.io/images/ruby-library-readme-header.gif" height="469" /></a>
</p>
