Timber for Node ships with an integration for the standard JavaScript `console` functions. This integration allows you to either output standard logs or append logs with custom metadata or events using the builtin `console.log` functions. See [usage](/docs/languages/node/usage) for more details.


## Warning
You might be wondering by now that why can't we simply use console.log() for logging, afterall its built in. While console.log() can be good for immediate debugging it shouldn't be used a logger at the application level. Few of the reasons are:

* You can't switch off the logs. Once a log statement is encountered, it will always be printed.
* You can't assign levels to logging. For example you might want certain kinds of logs only in development and not in production.

## Installation

This integration is automatically setup when you install Timber. Please follow the instructions for [installing Timber](/docs/languages/node/installation) to use the console integration.