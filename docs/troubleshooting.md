If you ever run into an issue while using Timber for Node, you can use the built-in debug logger to help identify the issue. When enabling the debug logger, Timber will write verbose debug logs to any stream you supply.


## How to use it

The most common way to use the debug logger is with a file stream, this can be done like this:

```js
const timber = require('timber')
const fs = require('fs')

timber.config.debug_logger = fs.createWriteStream('./debug.log', {flags: 'a'})
```

You can supply the `debug_logger` to any writeable stream. It's not recommended to set the `debug_logger` to `stdout` or `stderr` since Timber attaches to those streams by default.