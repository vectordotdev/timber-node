// This is the main file that gets referenced by node
import attach from './utils/attach'
import config from './config'
import install from './install'
import middlewares from './middlewares'
import transports from './transports'
import formatters from './formatters'
import events from './events'
import contexts from './contexts'
import log from './log'
import './console'

module.exports = {
  attach,
  config,
  install,
  middlewares,
  transports,
  formatters,
  log,
  events,
  contexts,
}
