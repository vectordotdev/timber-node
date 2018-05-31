# Node HTTP Installation

1. In your `shell`, *run*: <small style="float: right" class="platform-alt"><a href="/platforms/">prefer to integrate with your platform instead?</a></small>

  ```shell
  npm install --save timber
  ```

2. In your entry file, *add*:

  ```js
  const timber = require('timber');

  const transport = new timber.transports.HTTPS('{{my-timber-api-key}}');
  timber.install(transport);
  ```

3. Optionally install middleware:

    - Using [Express](https://github.com/expressjs/express)? ([learn more](../integrations/express)):

      ```js
      app.use(timber.middlewares.express())
      ```

4. Optionally integrate with your logger:

    - Using [winston](https://github.com/winstonjs/winston)? ([learn more](../integrations/winston))

      ```js
      winston.remove(winston.transports.Console);
      winston.add(winston.transports.Console, { formatter: timber.formatters.Winston });
      ```

    - Using [bunyan](https://github.com/trentm/node-bunyan)? ([learn more](../integrations/bunyan))

      ```js
      const log = bunyan.createLogger({
        name: 'Logger',
        stream: new timber.transports.Bunyan()
      });
      ```
