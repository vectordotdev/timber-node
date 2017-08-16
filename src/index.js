// This is the main file that gets referenced by node
import attach from './utils/attach'
import config from './config'
import install from './install'
import middlewares from './middlewares'
import transports from './transports'
import events from './events'
import contexts from './contexts'
import log from './log'
import logger from './logger'
import './console'

module.exports = {
  attach,
  config,
  install,
  middlewares,
  transports,
  log,
  logger,
  events,
  contexts,
}
