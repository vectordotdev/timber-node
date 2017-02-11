// This is the main file that gets referenced by node
import middlewares from './middlewares';
import transports from './transports';
import connect from './connect';
import Timber from './timber';

export default {
  middlewares,
  transports,
  connect,
  Client: Timber
}
