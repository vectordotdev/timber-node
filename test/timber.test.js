import Timber from '../src/timber';

describe('Timber Client', () => {

  it('exports a class', () => {
    expect(typeof Timber).toBe('function');
  });

  it('throws if instantiated improperly', () => {
    expect(() => {
      Timber();
    }).toThrow();
  });

  it('does not throw if instantiated properly', () => {
    expect(() => {
      new Timber();
    }).not.toThrow();
  });

});