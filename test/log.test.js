import LogEntry from '../src/log_entry';
import config from '../src/config';

describe('Log Transformer', () => {
  it('exports a function', () => {
    expect(typeof LogEntry).toBe('function');
  });

  it('requires a message', () => {
    expect(() => new LogEntry()).toThrow();
  });

  it('stores a data object', () => {
    const message = 'Test log line';
    const log = new LogEntry(message);

    expect(typeof log.data).toBe('object');
    expect(log.data.message).toBe(message);
  });

  it('append properly appends data values', () => {
    const message = 'Test log line';
    const log = new LogEntry(message);

    log.append({ customAttribute: 'test' });

    expect(log.data.customAttribute).toBe('test');
  });

  it('append replaces existing data values', () => {
    const message = 'Test log line';
    const log = new LogEntry(message);

    log.append({ level: 'error' });
    expect(log.data.level).toBe('error');

    log.append({ level: 'info' });
    expect(log.data.level).toBe('info');
  });

  it('setLevel properly sets the log level', () => {
    const message = 'Test log line';
    const log = new LogEntry(message);

    expect(typeof log.setLevel).toBe('function');

    log.setLevel('warn')

    expect(log.data.level).toBe('warn');
  });

  it('formats log properly', () => {
    const message = 'Test log line';
    const log = new LogEntry(message);
    const regex = new RegExp(`${message} ${config.metadata_delimiter} {.*}`);

    expect(typeof log.format).toBe('function');
    expect(log.format()).toMatch(regex);
  });

  it('format respects withMetadata option', () => {
    const message = 'Test log line';
    const log = new LogEntry(message);

    expect(log.format({ withMetadata: false })).toBe(`${message}\n`);
  });
});
