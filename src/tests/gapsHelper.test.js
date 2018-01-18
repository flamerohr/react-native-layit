/* global describe, test, expect */
import { calculate } from '../gapsHelper';

describe('calculate', () => {
  test('throws an error for invalid type', () => {
    expect(() => calculate('bob'))
      .toThrow();
    expect(() => calculate('invalid'))
      .toThrow();
    expect(() => calculate('margin'))
      .not.toThrow();
    expect(() => calculate('padding'))
      .not.toThrow();
  });

  test('should return an empty object if not number or array of numbers', () => {
    expect(calculate('margin'))
      .toEqual({});
    expect(calculate('padding', {}))
      .toEqual({});
    expect(calculate('margin', 'something!'))
      .toEqual({});
    expect(calculate('padding', ['bob', 'again']))
      .toEqual({});
    // falsey values are converted to 0
    expect(calculate('margin', [null, '', undefined, 15]))
      .toEqual({
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 15,
      });
  });

  test('should return an empty object if no items or more than 4 items', () => {

  });

  describe('behave like CSS margin/padding', () => {
    test('should return an all-sides style when provided a number or single item array', () => {
      expect(calculate('margin', 5))
        .toEqual({ margin: 5 });
      expect(calculate('margin', [25]))
        .toEqual({ margin: 25 });
      expect(calculate('padding', 15))
        .toEqual({ padding: 15 });
      expect(calculate('padding', [50]))
        .toEqual({ padding: 50 });
    });

    test('should return sides where vertical/horizontal are the same when two items in array', () => {
      expect(calculate('margin', [5, 25]))
        .toEqual({
          marginTop: 5,
          marginRight: 25,
          marginBottom: 5,
          marginLeft: 25,
        });
      expect(calculate('padding', [10, 15]))
        .toEqual({
          paddingTop: 10,
          paddingRight: 15,
          paddingBottom: 10,
          paddingLeft: 15,
        });
    });

    test('should return sides where horizontal are the same when three items in array', () => {
      expect(calculate('margin', [5, 25, 40]))
        .toEqual({
          marginTop: 5,
          marginRight: 25,
          marginBottom: 40,
          marginLeft: 25,
        });
      expect(calculate('padding', [10, 15, 2]))
        .toEqual({
          paddingTop: 10,
          paddingRight: 15,
          paddingBottom: 2,
          paddingLeft: 15,
        });
    });

    test('should return the proper sides when four items are given', () => {
      expect(calculate('margin', [5, 10, 15, 20]))
        .toEqual({
          marginTop: 5,
          marginRight: 10,
          marginBottom: 15,
          marginLeft: 20,
        });
      expect(calculate('padding', [25, 20, 15, 10]))
        .toEqual({
          paddingTop: 25,
          paddingRight: 20,
          paddingBottom: 15,
          paddingLeft: 10,
        });
    });
  });
});
