The [Timber for Node](https://github.com/timberio/timber-node) [Winston](https://github.com/winstonjs/winston) integration works with the Winston logger to ensure structured data is properly captured, providing for seamless integration between the Winston logger and Timber.

## Installation

```javascript
var winston = require('winston');
var timber = require('timber');

var logger = new (winston.Logger)({
  transports: [
  	// you can put any other transports here
    new timber.transports.Winston('your-api-key', options)
  ]
});

```

## Example

For more details examples demonstrating Winston with Timber, you can check out the following repositories:

1. [Winston + Express](https://github.com/timberio/examples/tree/master/node/express-winston)
