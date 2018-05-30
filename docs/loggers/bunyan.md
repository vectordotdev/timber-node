The [Timber for Node](https://github.com/timberio/timber-node) [Bunyan](https://github.com/trentm/node-bunyan) integration works with the Bunyan logger to ensure structured data is properly captured, providing for seamless integration between the bunyan logger and Timber.

## Installation

This integration is setup when you install Timber. Please follow the instructions for [installing Timber](../installation) to use this integration.

## Example

```javascript
const bunyan = require('bunyan')
const timber = require('timber')

const transport = new timber.transports.HTTPS('your-api-key')
timber.install(transport)

const log = bunyan.createLogger({ name: 'Timber Logger' })

log.info('Sample log message')

// Output:
// => Sample log message @metadata {"level": "info", ... }
```
