import { Writable, Readable } from 'stream';
import winston from 'winston';
import WinstonTransport from '../../src/transports/winston';

class TestWriteStream extends Writable {
  constructor() { super({ objectMode: true }) }
  _write(){}
}
class TestReadStream extends Readable {}

describe('Winston Transport', () => {
  it('should throw an error when no stream is provided', () => {
    expect(() => { new WinstonTransport() }).toThrow();
  })

  it('can be added to winston', () => {
    const stream = new TestWriteStream();

    expect(() => {
      winston.configure({
        transports: [
          new (WinstonTransport)({ stream })
        ]
      });
    }).not.toThrow();
  })

  it('logs messages to stream', () => {
    const message = 'Test log message';
    const level = 'info';
    const stream = new TestWriteStream();
    stream.cork();

    winston.configure({
      transports: [
        new (WinstonTransport)({ stream })
      ]
    });

    winston.log(level, message);

    const written = stream._writableState.getBuffer().pop().chunk;

    expect(written.message).toBe(message);
    expect(written.level).toBe(level);
  })

  it('augments logs with custom context', () => {
    const message = 'Test log message';
    const level = 'info';
    const context = { foo: 'bar' };
    const stream = new TestWriteStream();
    stream.cork();

    winston.configure({
      transports: [
        new (WinstonTransport)({ stream })
      ]
    });

    winston.log(level, message, { context });

    const written = stream._writableState.getBuffer().pop().chunk;

    expect(written.context).toBe(context);
  })

  it('augments logs with custom events', () => {
    const message = 'Test log message';
    const level = 'info';
    const event = { test_event_name: { foo: 'bar' } };
    const stream = new TestWriteStream();
    stream.cork();

    winston.configure({
      transports: [
        new (WinstonTransport)({ stream })
      ]
    });

    winston.log(level, message, { event });

    const written = stream._writableState.getBuffer().pop().chunk;

    expect(written.event).toMatchObject({ custom: event });
  })

  it('augments logs with metadata', () => {
    const message = 'Test log message';
    const level = 'info';
    const meta = { foo: 'bar' };
    const stream = new TestWriteStream();
    stream.cork();

    winston.configure({
      transports: [
        new (WinstonTransport)({ stream })
      ]
    });

    winston.log(level, message, meta);

    const written = stream._writableState.getBuffer().pop().chunk;

    expect(written.meta).toMatchObject(meta);
  })
})
