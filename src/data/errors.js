export default {
  transports: {
    winston: {
      stream: `You must provide a stream to the timber winston transport.
Use: winston.add(timber.transports.Winston, { stream: new timber.transports.HTTPS('api-key') })`,
    },
  },
  log: {
    noMessage: 'You must supply a message when creating a log',
  },
  install: {
    noTransport: 'No transport was provided.',
  },
  attach: {
    notWritable: 'Stream must be of type Writable',
  },
}
