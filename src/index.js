// This is the main file that gets referenced by node
import middlewares from './middlewares';
import transports from './transports';
import connect from './connect';
import install from './timber';

module.exports = {
  middlewares,
  transports,
  connect,
  install
}
