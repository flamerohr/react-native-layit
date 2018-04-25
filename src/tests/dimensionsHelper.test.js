/* global describe, test, expect */
import { calculate } from '../dimensionsHelper';

describe('calculate', () => {
  test('should throw if invalid type', () => {
    expect(() => calculate('Custom')).toThrow();
    expect(() => calculate('Another')).toThrow();
    expect(() => calculate('height')).toThrow();
    expect(() => calculate('Height')).not.toThrow();
    expect(() => calculate('Width')).not.toThrow();
  });

  test('should lower case the type given', () => {
    expect(calculate('Width', 40)).toEqual({ width: 40 });

    expect(calculate('Height', '40%')).toEqual({ height: '40%' });
  });

  test('should provide min and max without lowercase if array value', () => {
    expect(calculate('Width', [1, '2', 3])).toEqual({
      minWidth: 1,
      width: 2,
      maxWidth: 3,
    });

    expect(calculate('Height', ['1%', '2%', '3%'])).toEqual({
      minHeight: '1%',
      height: '2%',
      maxHeight: '3%',
    });
  });

  test('should ignore amounts that are not string or number', () => {
    expect(calculate('Width', {})).toEqual({});
    expect(calculate('Width', [{}, 50])).toEqual({ width: 50 });
  });
});
