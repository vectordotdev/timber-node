If you followed the [standard install instructions](../installation), your application will send all logs from `stdout` and `stderr` to Timber. If you prefer to send your logs to multiple destinations Timber has built-in support for this. Using the `attach` function, you can attach multiple writable streams to `stout` and `stderr`.

**Note:** The `attach()` function is a replacement for `install()`. When manually attaching streams, you no longer need to use `install()`.


## How to use it

### Example: Logging to Timber & a file

```js
const fs = require('fs')
const timber = require('timber')

const http_stream = new timber.transports.HTTPS('{{my-timber-api-key}}')
const file_stream = fs.createWriteStream('./app_logs', { flags: 'a' })

timber.attach([http_stream, file_stream], process.stdout)
timber.attach([http_stream, file_stream], process.stderr)
```
