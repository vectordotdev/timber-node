# Basic Logging

Timber integrates directly into stdout, so there's no special syntax required. Once you've installed Timber, you can continue using your logger as you normally would.


## How to use it

```js
// If you're using the standard js console logger:
console.info("Info message")
console.warn("Warn message")
console.error("Error message")

// If you're using winston:
winston.info("Info message")
winston.warn("Warn message")
winston.error("Error message")

// If you're using bunyan:
logger.info("Info message")
logger.warn("Warn message")
logger.error("Error message")
```

We encourage standard / traditional log messages for non-meaningful events. And because Timber [_augments_](/docs/concepts/structuring-through-augmentation) your logs with metadata, you don't have to worry about making every log structured!