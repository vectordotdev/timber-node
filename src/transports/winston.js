import HTTPS from './https'
import LogEntry from '../log_entry'
import debug from '../utils/debug'
// Look into https://github.com/winstonjs/winston-transport
// https://github.com/avens19/winston-sumologic-transport/blob/master/src/winston-sumologic-transport.ts

class WinstonTransport extends HTTPS {
	constructor (key, options) {
		super(key, options);
		this.name = 'Timber'
		this.applyBackPressure = options.applyBackPressure
	}

	log (level, message, meta, callback) {
		const data = { level, message, meta }
		const log = new LogEntry(message, meta, level)
		const written = this.write(log.data)

    if (!written && this.applyBackPressure) {
      transport.once('drain', () => transport.write(log.data))
      callback();
    } else {
    	callback();
    }
	}
}

export default WinstonTransport
