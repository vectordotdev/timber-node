'use strict';

import HTTPS from './https';

/**
 * A protocol ambiguous stream for sending logs to Timber over the network.
 *
 * The purpose of this class is to avoid having our clients commit to a protocol, such as HTTP.
 * If, in the future, we support a better protocol, such as TCP, we can automatically upgrade you.
 *
 * If you'd like to explicitly use HTTP, please use the HTTPSStream class instead.
 */
class Network extends HTTPS {}

export default Network;