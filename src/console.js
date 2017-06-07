import util from 'util'
import debug from './utils/debug'
import Log from './utils/log'

// Console overrides
// FYI: Would need to override every console method since the prototype
// is bound to the original Console instance, for now we're treating
// everything that's not 'error' as 'info'

console.info = (...args) => {
  const log = args[0] instanceof Log
    ? args[0]
    : new Log(`${util.format.apply(null, args)}\n`)
  log.setLevel('info')
  process.stdout.write(log)
}

console.log = (...args) => {
  const log = args[0] instanceof Log
    ? args[0]
    : new Log(`${util.format.apply(null, args)}\n`)
  log.setLevel('info')
  process.stdout.write(log)
}

console.warn = (...args) => {
  const log = args[0] instanceof Log
    ? args[0]
    : new Log(`${util.format.apply(null, args)}\n`)
  log.setLevel('warn')
  process.stdout.write(log)
}

console.error = (...args) => {
  const log = args[0] instanceof Log
    ? args[0]
    : new Log(`${util.format.apply(null, args)}\n`)
  log.setLevel('error')
  process.stdout.write(log)
}

export default console
