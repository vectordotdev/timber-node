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

// => My log message @metadata {"level": "info", ... }

console.info("My log message")

// => My log message @metadata {"level": "info", ... }

console.warn("My log message")

// => My log message @metadata {"level": "warn", ... }

console.error("My log message")

// => My log message @metadata {"level": "error", ... }
```

Timber patches over the default `console.log` functions to provide an easy way to attach custom metadata or events to a log line. To take advantage of it, use the following structure when logging:

```js
console.log("My Log Message", { meta: { ... } });
```

This works with all console log levels (`console.log`, `console.info`, `console.warn`, and `console.error`).

Logging custom events are just as easy:


```js
console.log("My Log Message with a custom event", { event: { custom_event_name: { ... } } });
```

Just like metadata, custom events can be attached to any console log level.

---

</p></details>

<details><summary><strong>Express middleware</strong></summary><p>

If you're using express, you can use the timber middleware to automatically log
all http request/response events

```js
const express = require('express')
const timber = require('timber')

// first we create a writeable stream that your logs will get sent to
const transport = new timber.transports.HTTPS('your-timber-api-key');

// attach the stream to stdout
timber.install(transport);

// create our express app
const app = express()

// attach the timber middleware
app.use(timber.middlewares.express())

app.get('/', function (req, res) {
  res.send('hello, world!')
})

// Output:
// => Started GET "/" @metadata {"level": "error", "context": {...}}
// => Outgoing HTTP response 200 in 2ms @metadata {"level": "error", "context": {...}}
```

The express middleware accepts a single argument for configuration options. To learn more about the available options, [visit the express integration docs](https://timber.io/docs/languages/node/integrations/express#configuration)

---

</p></details>

<details><summary><strong>Logging with Winston</strong></summary><p>

If you're using [winston](https://github.com/winstonjs/winston), you can use the winston transport to send all of winston's logs to timber.io

```js
const winston = require('winston')
const timber = require('timber')

const transport = new timber.transports.HTTPS('your-api-key')
timber.install(transport)

winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  formatter: timber.formatters.Winston
})

winston.log('info', 'Sample log message')

// Output:
// => Sample log message @metadata {"level": "info", ... }
```

When you pass a metadata object to winston, timber will automatically augment your log line with it:

```js
winston.log('info', 'Log message with metadata', { user: 'username' })

// Output:
// => Log message with metadata @metadata {"level": "info", meta: { user: 'username' }, ... }
```

You can augment your log with a custom event by providing an `event` key at the root of your metadata object:

```js
winston.log('info', 'Log message with event', { event: custom_event_name: { ... } })

// Output:
// => Log message with event @metadata {"level": "info", event: { custom_event_name: { ... } }, ... }
```

Adding custom context is just as easily done by adding the `context` key to the root of your metadata object:

```js
winston.log('info', 'Log message with event', { context: { ... } })

// Output:
// => Log message with event @metadata {"level": "info", context: { ... }, ... }
```
If you're using the timber express middleware, you'll most likely want to configure it to use winston as the logger. This can be done by setting the `logger` config attribute to `winston`:

```js
timber.config.logger = winston
```

---

</p></details>

<details><summary><strong>Logging with Bunyan</strong></summary><p>

If you're using [bunyan](https://github.com/trentm/node-bunyan), you can use the bunyan transport to send all of bunyan's logs to timber.io

```js
const bunyan = require('bunyan')
const timber = require('timber')

const winston = require('winston')
const timber = require('timber')

const transport = new timber.transports.HTTPS('your-api-key')
timber.install(transport)

const log = bunyan.createLogger({ name: 'Timber Logger' })

log.info('Sample log message')

// Output:
// => Sample log message @metadata {"level": "info", ... }
```

If you want to augment your log with custom metadata, simply add an object as the first argument:

```js
log.info({ user: 'username' }, 'Log message with metadata')

// Output:
// => Log message with metadata @metadata {"level": "info", meta: { user: 'username' }}, ... }
```

You can augment your log with a custom event by providing an `event` key at the root of your metadata object:

```js
log.info({ event: { custom_event_name: { ... } } }, 'Log message with event')

// Output:
// => Log message with event @metadata {"level": "info", event: { custom_event_name: { ... } }, ... }
```

Adding custom context is just as easily done by adding the `context` key to the root of your metadata object:

```js
log.info({ context: { ... } }, 'Log message with event')

// Output:
// => Log message with event @metadata {"level": "info", context: { ... }, ... }
```

If you're using the timber express middleware, you'll most likely want to configure it to use bunyan as the logger. This can be done by setting the `logger` config attribute to the bunyan logger you created:

```js
timber.config.logger = log 
```

---

</p></details>

<details><summary><strong>Attaching to a custom stream</strong></summary><p>

In most applications, you're going to want to attach the timber transport to `stdout` and `stderr`. This is why we supply the convenient `timber.install(transport)` function. However, it's possible to attach the transport to _any_ writeable stream using the `timber.attach()` function!

```js
const transport = timber.transports.HTTPS('timber-api-key')

// This is what the install() command is doing:
timber.attach([transport], process.stdout)
timber.attach([transport], process.stderr)
// => This sends all logs from stdout directly to Timber

// You can attach multiple unique transport streams to each stream:
const file_transport = fs.createWriteStream("./output.log", {flags: "a"})
timber.attach([transport, file_transport], process.stdout)
// => This sends all logs from stdout to Timber, stdout, and a custom log file
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
