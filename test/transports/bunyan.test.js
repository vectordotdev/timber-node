import { Writable, Readable } from 'stream';
import bunyan from 'bunyan';
import BunyanTransport from '../../src/transports/bunyan';

class TestWriteStream extends Writable {
  constructor() { super({ objectMode: true }) }
  _write(){}
}
class TestReadStream extends Readable {}

describe('Bunyan Transport', () => {
  it('should use stdout as default stream', () => {
    const log = bunyan.createLogger({
      name: 'Timber Logger'
    });
    expect(log.streams[0].stream).toBe(process.stdout);
  })

  // it('can be added to winston', () => {
  //   const stream = new TestWriteStream();

  //   expect(() => {
  //     const log = bunyan.createLogger({
  //       name: 'Timber Logger',
  //       stream: new BunyanTransport({ stream })
  //     });
  //   }).not.toThrow();
  // })

  // it('logs messages to stream', () => {
  //   const message = 'Test log message';
  //   const level = 'info';
  //   const stream = new TestWriteStream();
  //   stream.cork();

  //   const log = bunyan.createLogger({
  //     name: 'Timber Logger',
  //     stream: new BunyanTransport({ stream })
  //   });

  //   log[level](message);

  //   const written = stream._writableState.getBuffer().pop().chunk;

  //   expect(written.message).toBe(message);
  //   expect(written.level).toBe(level);
  // })

  // it('augments logs with custom context', () => {
  //   const message = 'Test log message';
  //   const level = 'info';
  //   const context = { foo: 'bar' };
  //   const stream = new TestWriteStream();
  //   stream.cork();

  //   const log = bunyan.createLogger({
  //     name: 'Timber Logger',
  //     stream: new BunyanTransport({ stream })
  //   });

  //   log[level]({ context }, message);

  //   const written = stream._writableState.getBuffer().pop().chunk;

  //   expect(written.context).toMatchObject(context);
  // })

  // it('augments logs with custom events', () => {
  //   const message = 'Test log message';
  //   const level = 'info';
  //   const event = { test_event_name: { foo: 'bar' } };
  //   const stream = new TestWriteStream();
  //   stream.cork();

  //   const log = bunyan.createLogger({
  //     name: 'Timber Logger',
  //     stream: new BunyanTransport({ stream })
  //   });

  //   log[level]({ event }, message);

  //   const written = stream._writableState.getBuffer().pop().chunk;

  //   expect(written.event).toMatchObject({ custom: event });
  // })

  // it('augments logs with metadata', () => {
  //   const message = 'Test log message';
  //   const level = 'info';
  //   const meta = { foo: 'bar' };
  //   const stream = new TestWriteStream();
  //   stream.cork();

  //   const log = bunyan.createLogger({
  //     name: 'Timber Logger',
  //     stream: new BunyanTransport({ stream })
  //   });

  //   log[level](meta, message);

  //   const written = stream._writableState.getBuffer().pop().chunk;

  //   expect(written.meta).toMatchObject(meta);
  // })
})

