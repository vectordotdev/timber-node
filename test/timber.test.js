import { install, Timber } from '../src/timber';
import { Readable, Writable } from 'stream';
import utils from 'util';

describe('Install', () => {
  it('exports a function', () => {
    expect(typeof install).toBe('function');
  });

  it('returns a Timber client instance', () => {
    const client = install({});
    expect(client).toBeInstanceOf(Timber);
  });
});

describe('Timber Client', () => {});