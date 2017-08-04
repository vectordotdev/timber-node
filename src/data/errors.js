export default {
  transports: {
    winston: {
      apiKey: `You cannot set up the timber winston transport without an apiKey.
Use: winston.add(timber.transports.Winston, { apiKey: 'your-api-ley' })`,
    }
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
};
