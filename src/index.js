// This is the main file that gets referenced by node
import attach from './utils/attach'
import config from './config'
import install from './install'
import middlewares from './middlewares'
import transports from './transports'
import formatters from './formatters'
import events from './events'
import contexts from './contexts'
import LogEntry from './log_entry'
import './console'

module.exports = {
  attach,
  config,
  contexts,
  events,
  formatters,
  install,
  LogEntry,
  middlewares,
  transports,
}
