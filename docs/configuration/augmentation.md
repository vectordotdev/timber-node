# Automatic Log Augmentation

Timber for Node will automatically augment all log lines with rich structured data. This will turn ordinary log lines like:

```
Sent 200 in 45.ms
```

into this:

```
Sent 200 in 45.2ms @metadata {"dt": "2017-02-02T01:33:21.154345Z", "level": "info", "context": {"http": {"method": "GET", "host": "timber.io", "path": "/path", "request_id": "abcd1234"}}, "event": {"http_response": {"status": 200, "time_ms": 45.2}}}
```

But when using Timber for Node in a development environment, having all that extra noise in your console can make it difficult to read your logs. For this reason, Timber only appends metadata when the `NODE_ENV` is set to `production`. If you want to override this setting, you can use the `append_metadata` configuration option.

## How to use it

```js
timber.config.append_metadata = true
```