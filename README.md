# Timber Node
 [![Build Status](https://travis-ci.org/timberio/timber-node.svg)](https://travis-ci.org/timberio/timber-node) [![Coverage Status](https://coveralls.io/repos/timberio/timber-node/badge.svg?branch=master&service=github)](https://coveralls.io/github/timberio/timber-node?branch=master)

## Usage

```
var Timber = require('timber');
var logger = new Timber('API Key');
```

## npm scripts

`watch` - starts file watcher

`lint` - runs eslint on `/src`

`test` - runs tests and formats piped TAP output with [tap-spec](https://github.com/scottcorgan/tap-spec).

`ci` - Travis CI integration + zuul multi-framework & browser tests

`cover` - generates code coverage text-summary report in terminal

`report` - generates code coverage html report and opens it in browser

`coveralls` - runs code coverage and sends report to coveralls

`zuul` - runs browser tests via zuul at `http://localhost:9966/__zuul`

## devDependencies:

- [**babel**](https://github.com/babel/babel) - compiler for writing next generation JavaScript

- [**babel-eslint**](https://github.com/babel/babel-eslint) - ESLint using Babel as the parser

- [**babel-istanbul**](https://github.com/ambitioninc/babel-istanbul) - excellent coverage tool

- [**babelify**](https://github.com/babel/babelify) - Browserify transform for Babel. Used in multi-framework testing with zuul.

- [**blue-tape**](https://github.com/spion/blue-tape) - substack's tape test runner with promise support

- [**coveralls**](https://github.com/nickmerwin/node-coveralls) - test coverage and history statistics support for node.js

- [**eslint**](https://github.com/eslint/eslint) - A fully pluggable tool for identifying and reporting on patterns in JavaScript.

- [**eslint-config-xo**](https://github.com/sindresorhus/eslint-config-xo) - ESLint shareable config for XO

- [**eslint-plugin-babel**](https://github.com/babel/eslint-plugin-babel) - an eslint rule plugin companion to babel-eslint

- [**nsp**](https://github.com/nodesecurity/nsp) - check for vulnerabilities

- [**rimraf**](https://github.com/isaacs/rimraf) - remove stuff

- [**tap-spec**](https://github.com/scottcorgan/tap-spec) - formatted TAP output

- [**zuul**](https://github.com/defunctzombie/zuul) - multi-framework javascript browser testing


## Travis CI / Sauce Connect Configuration

[**Sauce Connect**](https://docs.saucelabs.com/reference/sauce-connect/) -  Used to create tunnel allowing [Travis CI](https://travis-ci.org/) to utilize [Sauce Labs](https://saucelabs.com), a browser and mobile testing platform.

If you plan to use Sauce Connect in your new module, be sure to [sign up](https://saucelabs.com/signup) with Sauce Labs if you haven’t already (it’s free for Open Source projects), and get your access key from your account page.

Then you'll want to replace the secured access key in `.travis.yml` with your own. See the [Getting Started](https://docs.saucelabs.com/ci-integrations/travis-ci/) guide on Travis for more info on setting this up.

Best bet if you're a new Travis and/or Sauce Labs user is to follow their steps to create a new `.travis.yml` file.

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

[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md) [![Hex.pm](https://img.shields.io/hexpm/v/timber.svg?maxAge=18000=plastic)](https://hex.pm/packages/timber) [![Documentation](https://img.shields.io/badge/hexdocs-latest-blue.svg)](https://hexdocs.pm/timber/index.html) [![CircleCI branch](https://img.shields.io/circleci/project/timberio/timber-elixir/master.svg?maxAge=18000=plastic)](https://circleci.com/gh/timberio/timber-elixir/tree/master) [![Coverage Status](https://coveralls.io/repos/github/timberio/timber-elixir/badge.svg?branch=master)](https://coveralls.io/github/timberio/timber-elixir=master)

:point_right: **Timber is in beta testing, if interested in joining, please email us at [beta@timber.io](mailto:beta@timber.io)**

* **[What is Timber?](#what-is-timber)**
* **[Usage](#usage)**
* **[Installation](#installation)**
* **[Configuration](#configuration)**
* **[Send your logs](#send-your-logs)**


## What is Timber?

Timber is a thoughtful, carefully crafted, fully-managed, *structured* logging strategy.
Timber enables you to *quickly* realize the power of proper structured logs so that you can
spend more time focusing on your app, and less time focusing on logging.

More specifically, Timber...

1. Automatically structures your framework and 3rd party logs ([see below](#what-events-does-timber-structure-for-me)).
2. Provides a [framework for logging custom events](#what-about-custom-events).
3. Does not lock you in with a special API or closed data. Just better logging.
4. Defines a [normalized log schema](https://github.com/timberio/log-event-json-schema) across *all* of your apps. Implemented by [our libraries](https://github.com/timberio).
5. Offers a [beautiful modern console](https://timber.io) designed specifically for this data. Pre-configured and tuned out of the box.
6. Gives you *6 months of retention*, by default.
7. Does not charge you for the extra structured data we're encouraging here, only the core log message.
8. Encrypts your data in transit and at rest.
9. Offers 11 9s of durability.
10. ...and so much more!

To learn more, checkout out [timber.io](https://timber.io) or the
["why we started Timber"](http://moss-ibex2.cloudvent.net/blog/why-were-building-timber/)
blog post.


## Usage

### Basic usage

Just log like you've always logged:

```js
console.log('my message')
```

### Custom events

Coming soon!

### Custom context

Coming soon!


## Installation

  ```shell
  npm install timber
  ```


## Configuration

<details><summary><strong>Express</strong></summary><p>

Express

</p></details>


<details><summary><strong>Koa</strong></summary><p>

Koa

</p></details>


<details><summary><strong>Morgan</strong></summary><p>

Manual setup of context and events?

</p></details>


<details><summary><strong>Winston</strong></summary><p>

Manual setup of context and events?

</p></details>


## Send your logs

<details><summary><strong>Heroku (log drains)</strong></summary><p>

We recommend adding a Heroku log drain. To get your heroku log drain url:

**--> [Add your app to Timber](https://app.timber.io)**

*:information_desk_person: Note: for high volume apps Heroku log drains will drop messages. This
is true for any Heroku app, in which case we recommend the Network method below.*

</p></details>

<details><summary><strong>All other platforms (Network / HTTP)</strong></summary><p>

1. **Configure Timber to send logs over the network.**

   ```js
   const TimberNetworkStream = require('timber/transports/network_stream');
   require('timber/stdout_connect')(new TimberNetworkStream(process.env.TIMBER_API_KEY));
   ```

   *:information_desk_person: Note: we use `TimberNetworkStream` to provide flexibility in the
   protocol we use. For example, this allows us to upgrade to TCP in the future. If you prefer
   HTTP and do not want to ever deviate, you can swap in `TimberHTTPSStream` instead.

2. **Obtain your Timber API :key: by [adding your app in Timber](https://app.timber.io).**

</p></details>

<details><summary><strong>Advanced setup (syslog, file tailing agent, etc)</strong></summary><p>

Checkout our [docs](https://timber.io/docs) for a comprehensive list of install instructions.

</p></details>

---

<p align="center" style="background: #140f2a;">
<a href="http://github.com/timberio/timber-elixir"><img src="http://files.timber.io/images/ruby-library-readme-log-truth.png" height="947" /></a>
</p>


