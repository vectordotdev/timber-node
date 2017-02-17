import connect from './connect';
import HTTPSStream from './transports/https';

function install(options) {
  const transportStream = new HTTPSStream(options.apiKey, options);
  connect(transportStream);
}

module.exports = install;
