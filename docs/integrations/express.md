The [Timber for Node](https://github.com/timberio/timber-node) [Express](http://expressjs.com) integration automatically outputs [augmented](/concepts/structuring-through-augmentation) log lines for all HTTP events.

|You'll Get|
|:------|
|<i>+</i>[HTTP request event](/concepts/log-event-json-schema/events/http-request)|
|<i>+</i>[HTTP response event](/concepts/log-event-json-schema/events/http-response)|


## What you can do

1. [**Trace HTTP requests**](/app/console/trace-http-requests)
2. [**Inspect HTTP requests & their parameters**](/app/console/inspect-http-requests)
3. [**Inspect Express logs and view their associated metadata**](/app/console/view-a-logs-metadata-and-context)
4. [**Search on Express structured data**](/app/console/searching)
5. [**Alert on Express structured data**](/app/alerts)


## Installation

```js
const express = require('express')
const timber = require('timber')

const transport = new timber.transports.HTTPS('your-timber-api-key');
timber.install(transport);

const app = express()

app.use(timber.middlewares.express())

app.get('/', function (req, res) {
  res.send('hello, world!')
})

// Output when loading index route:
// => Started GET "/" @metadata {"level": "error", "context": {...}}
// => Outgoing HTTP response 200 in 2ms @metadata {"level": "error", ... }
```

## Configuration

You can pass a configuration object as an argument to the middleware if you want to use a custom configuration. The available options are:

- `capture_request_body` (`boolean`): Enables capturing of the http request body data (`false` by default)
- `combine_http_events` (`boolean`): If enabled, the HTTPRequest and HTTPResponse events will be combined in a single log message (`false` by defaut)
- `logger` (`object`): Pass a reference of your logger if you want the express logs sent to multiple destinations (read the below section for more information)

## Using with a custom logger

If you're using winston or bunyan for logging, it's possible to route the express event logs through your preferred logger. This is not required if you're only sending your logs to Timber, but may be desired if you want the express event logs sent to multiple transports streams. To enable this, pass a reference of your logger to the middleware:

```js
// If you're using winston:
const winston = require('winston')
app.use(timber.middlewares.express({ logger: winston }))

// If you're using bunyan:
const bunyan = require('bunyan')
const logger = bunyan.createLogger({ name: 'Custom Logger' })
app.use(timber.middlewares.express({ logger: winston }))
```
