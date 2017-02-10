import { Timber } from '../src/index';
import test from 'blue-tape';

test('exports a class', t => {
  t.equal(typeof Timber, 'function');
  t.end();
});

test('throws if instantiated improperly', t => {
  t.throws(() => {
    Timber();
  });
  t.end();
});

test('does not throw if instantiated properly', t => {
  t.doesNotThrow(() => {
    new Timber();
  });
  t.end();
});