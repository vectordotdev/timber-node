// Explicity import middlewares and transport methods
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
