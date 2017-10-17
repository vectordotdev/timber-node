# 🌲 Timber - Great Node Logging Made Easy

[![CircleCI](https://circleci.com/gh/timberio/timber-node.svg?style=svg)](https://circleci.com/gh/timberio/timber-node)
[![Coverage Status](https://coveralls.io/repos/github/timberio/timber-node/badge.svg?branch=master)](https://coveralls.io/github/timberio/timber-node?branch=master)
[![npm version](https://badge.fury.io/js/timber.svg)](https://badge.fury.io/js/timber)
[![ISC License](https://img.shields.io/badge/license-ISC-ff69b4.svg)](LICENSE.md)

Node logging has problems. The average node project has libraries logging to the
`console`, internal logs using [winston](https://github.com/winstonjs/winston) or
[bunyan](https://github.com/trentm/node-bunyan), and frameworks logging in their own format.
The end result is usually this:

```
192.442.345.32 - - [Mon, 09 Oct 2017 23:23:37 GMT] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
Log message from console.warn
{"level":"debug","message":"Log message from winston"}
```

Timber solves this by normalizing and augmenting your logs with structured data, *regardless of
the source*. This not only normalizes your logs, but captures additional useful metadata:

```
GET / HTTP/1.1 @metadata {"dt": "2017-10-08T23:23:37.234Z", "level": "info", "context": {"http": {"remote_addr": "192.442.345.32"}}, "event": {"http_request": {"method": "GET", "path": "/", "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"}}}
Log message from console.warn @metadata {"dt": "2017-10-08T23:23:37.234Z", "level": "warn"}
Log message from winston @metadata {"dt": "2017-10-08T23:23:37.234Z", "level": "debug"}
```

Ah! Consistent, easy to use logs. To get started:

1. [**Installation** - Simple setup](#installation)
2. [**Usage** - Clean API. Works with `console`, winston, and bunyan.](#usage)
3. [**Integrations** - Automatic context and metadata for your existing logs](#integrations)
4. [**The Timber Console** - Beautiful, fast, and designed for developers](#the-timber-console)
5. [**Get things done with your logs 💪**](#get-things-done-with-your-logs)


## Installation

**[Signup at timber.io](https://app.timber.io) and follow the in-app instructions.**

For those interested in manual instructions, see [the timber.io installation docs](https://timber.io/docs/languages/node/installation).


## Usage

<details><summary><strong>Basic logging</strong></summary><p>

No special API, Timber works directly with your logger of choice:

```js
// console
console.log("My log message")
console.info("My log message")
console.warn("My log message")
console.error("My log message")

// winston
winston.info("My log message")
winston.warn("My log message")
// ...

// bunyan
logger.info("My log message")
logger.warn("My log message")
// ...
```

---

</p></details>

<details><summary><strong>Logging events (structured data)</strong></summary><p>

Log structured data without sacrificing readability:

```js
// console
console.warn("Payment rejected", {
  event: {
    payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }
  }
});

// winston
winston.warn("Payment rejected", {
  event: {
    payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }
  }
});

// bunyan
logger.warn({
  event: {
    payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }
  }
}, "Payment rejected");
```

---

</p></details>

<details><summary><strong>Setting context</strong></summary><p>

[Context](https://timber.io/docs/concepts/metadata-context-and-events) for node is coming soon!
Because node does not have a concept of local storage, we're working to implement
[continuation local storage](https://github.com/othiym23/node-continuation-local-storage).
This will enable shared join data across your logs, allowing you to relate them.

Star / watch this repo to be notified when this goes live!

</p></details>


## Configuration

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

<details><summary><strong>Attaching a custom stream</strong></summary><p>

By default, Timber makes attaching to `stdout` and `stderr` very easy through the convenient `timber.install(transport)` function.
However, it's possible to attach the transport to _any_ [writeable stream](https://nodejs.org/api/stream.html#stream_writable_streams)
using the `timber.attach()` function!

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


## Integrations

Timber integrates with popular frameworks and libraries to capture context and metadata you
couldn't otherwise. This automatically augments logs produced by these libraries, making them
[easier to search and use](#do-amazing-things-with-your-logs). Below is a list of libraries we
support:

* Frameworks
   * [**Express**](https://timber.io/docs/languages/node/integrations/express)
* Loggers
   * [**Bunyan**](https://timber.io/docs/languages/node/integrations/bunyan)
   * [**Console**](https://timber.io/docs/languages/node/integrations/console)
   * [**Winston**](https://timber.io/docs/languages/node/integrations/winston)
* Platforms
   * [**System / Server**](https://timber.io/docs/languages/node/integrations/system)

...more coming soon! Make a request by [opening an issue](https://github.com/timberio/timber-node/issues/new)


## Get things done with your logs

Logging features designed to help developers get more done:

1. [**Powerful searching.** - Find what you need faster.](https://timber.io/docs/app/console/searching)
2. [**Live tail users.** - Easily solve customer issues.](https://timber.io/docs/app/console/tail-a-user)
3. [**Viw logs per HTTP request.** - See the full story without the noise.](https://timber.io/docs/app/console/trace-http-requests)
4. [**Inspect HTTP request parameters.** - Quickly reproduce issues.](https://timber.io/docs/app/console/inspect-http-requests)
5. [**Threshold based alerting.** - Know when things break.](https://timber.io/docs/app/alerts)
6. ...and more! Checkout our [the Timber application docs](https://timber.io/docs/app)


## The Timber Console

[![Timber Console](http://files.timber.io/images/readme-interface7.gif)](https://timber.io/docs/app)

[Learn more about our app.](https://timber.io/docs/app)

## Your Moment of Zen

<p align="center" style="background: #221f40;">
<a href="https://timber.io"><img src="http://files.timber.io/images/readme-log-truth.png" height="947" /></a>
</p>
ustomer issues.](https://timber.io/docs/app/console/tail-a-user)
3. [**Viw logs per HTTP request.** - See the full story without the noise.](https://timber.io/docs/app/console/trace-http-requests)
4. [**Inspect HTTP request parameters.** - Quickly reproduce issues.](https://timber.io/docs/app/console/inspect-http-requests)
5. [**Threshold based alerting.** - Know when things break.](https://timber.io/docs/app/alerts)
6. ...and more! Checkout our [the Timber application docs](https://timber.io/docs/app)


## The Timber Console

[![Timber Console](http://files.timber.io/images/readme-interface7.gif)](https://timber.io/docs/app)

[Learn more about our app.](https://timber.io/docs/app)

## Your Moment of Zen

<p align="center" style="background: #221f40;">
<a href="https://timber.io"><img src="http://files.timber.io/images/readme-log-truth.png" height="947" /></a>
</p>
