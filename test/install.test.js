import install from '../src/install';
import { Readable, Writable } from 'stream';

describe('Install', () => {
  it('exports a function', () => {
    expect(typeof install).toBe('function');
  });
});
