// This is the main file that gets referenced by node
import middlewares from './middlewares';
import transports from './transports';
import connect from './connect';
import timber from './timber';

export default {
  middlewares,
  transports,
  connect,
  client: timber
}
