# 🌲 Timber - Simple Node Structured Logging

[![CircleCI](https://circleci.com/gh/timberio/timber-node.svg?style=svg)](https://circleci.com/gh/timberio/timber-node)
[![Coverage Status](https://coveralls.io/repos/github/timberio/timber-node/badge.svg?branch=master)](https://coveralls.io/github/timberio/timber-node?branch=master)
[![npm version](https://badge.fury.io/js/timber.svg)](https://badge.fury.io/js/timber)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

* [Timber website](https://timber.io)
* [Timber docs](https://timber.io/docs)
* [Library docs](https://timberio.github.io/timber-node/)
* [Support](mailto:support@timber.io)


## Overview

Timber solves node structured logging so you don't have to. Go from raw text logs to rich
structured events in seconds. Spend more time focusing on your app and less time
focusing on logging.

1. **Easy setup.** - `npm install --save timber`, [get setup in seconds](#installation).

2. **Automatically structures yours logs.** - Third-party and in-app logs are all structured
   in a consistent format. See [how it works](#how-it-works) below.

3. **Seamlessly integrates with popular libraries and frameworks.** - Express, Winston, Morgan, etc. [Automatically captures user context, HTTP context, and event data.](#third-party-integrations)

4. **Pairs with a modern structured-logging console.** - Designed specifically for structured data,
   hosted, instantly usable, tail users, trace requests.
   [Checkout the docs](https://timber.io/docs/app/tutorials/).

## Installation

1. In your `shell` run `npm install --save timber`

2. Add the following lines to your entry file

```js
const timber = require('timber');

// first we create a writeable stream that the logs will get sent to
const transport = new timber.transports.HTTPS('your-timber-api-key');

// attach the stream to stdout
timber.install(transport);
```

## How it works

For example, Timber turns this raw text log:

```
Sent 200 in 45.ms
```

Into a rich [`http_server_response` event](https://timber.io/docs/node/events-and-context/http-server-response-event/).

```
Sent 200 in 45.2ms @metadata {"dt": "2017-02-02T01:33:21.154345Z", "level": "info", "context": {"http": {"method": "GET", "host": "timber.io", "path": "/path", "request_id": "abcd1234"}}, "event": {"http_response": {"status": 200, "time_ms": 45.2}}}
```

Notice that instead of completely replacing your log messages,
Timber _augments_ your logs with structured metadata. Turning them into
[rich events with context](https://timber.io/docs/node/events-and-context) without sacrificing
readability. And you have [complete control over which data is captured](#configuration).



## Usage

<details><summary><strong>Basic logging</strong></summary><p>

No special API, Timber works directly with `console.log`:

```js
console.log("My log message")

// => My log message @metadata {"level": "info", "context": {...}}

console.info("My log message")

// => My log message @metadata {"level": "info", "context": {...}}

console.warn("My log message")

// => My log message @metadata {"level": "warn", "context": {...}}

console.error("My log message")

// => My log message @metadata {"level": "error", "context": {...}}
```

---

</p></details>

<details><summary><strong>Express middleware</strong></summary><p>

If you're using express, you can use the timber middleware to automatically log
all http request/response events

```js
const express = require('express')
const timber = require('timber')

// first we create a writeable stream that the logs will get sent to
const transport = new timber.transports.HTTPS('your-timber-api-key');

// attach the stream to stdout
timber.install(transport);

// create our express app
const app = express()

// attach the timber middleware
app.use(timber.middlewares.express)

app.get('/', function (req, res) {
  res.send('hello, world!')
})

// Output:
// => Started GET "/" @metadata {"level": "error", "context": {...}}
// => Outgoing HTTP response 200 in 2ms @metadata {"level": "error", "context": {...}}
```

---

</p></details>

<details><summary><strong>Custom events</strong></summary><p>

Custom events are currently not supported in the current version of the Node library. We are planning to add support for them soon!

---

</p></details>

<details><summary><strong>Custom contexts</strong></summary><p>

Custom contexts are currently not supported in the current version of the Node library. We are planning to add support for them soon!


</p></details>


## Jibber-Jabber

<details><summary><strong>Which events and contexts does Timber capture for me?</strong></summary><p>

Out of the box you get everything in the
[`Timber::Events`](https://github.com/timberio/timber-node/src/events) namespace.

We also add context to every log, everything in the
[`Timber::Contexts`](https://github.com/timberio/timber-node/src/contexts)
namespace. Context is structured data representing the current environment when the log line
was written. It is included in every log line. Think of it like join data for your logs. It's
how Timber is able to accomplished tailing users (`context.user.id:1`).

---

</p></details>

<details><summary><strong>Won't this increase the size of my log data?</strong></summary><p>

Yes, but it's marginal compared to the benefits of having rich structured log data. A few
of things to note:

1. Timber generally _reduces_ the amount of logs your app generates, trading quality for quantity.
   It does so by providing options to consolidate request / response logs, template logs, and
   even silence logs that are not of value to you. (see [configuration](#configuration) for examples).
2. Timber lets you pick exactly which events and contexts you want.
   (see [configuration](#configuration) for examples)
3. Your logging provider should be compressing your data and charging you accordingly. Log data
   is notoriously repetitive, and the context Timber generates is repetitive.
   Because of compression we've seen somes apps only incur a ~15% increase in data size.

Finally, log what is useful to you. Quality over quantity certainly applies to logging.

---

</p></details>

<details><summary><strong>What about my current log statements?</strong></summary><p>

They'll continue to work as expected. Timber adheres to the default `console` interface.
Your previous logger calls will work as they always do. Just import the timber library to your project and you're good to go!

In fact, traditional log statements for non-meaningful events, debug statements, etc, are
encouraged. In cases where the data is meaningful, consider [logging a custom event](#usage).

---

</p></details>

---

<p align="center" style="background: #221f40;">
<a href="http://github.com/timberio/timber-elixir"><img src="http://files.timber.io/images/ruby-library-readme-log-truth.png" height="947" /></a>
</p>
