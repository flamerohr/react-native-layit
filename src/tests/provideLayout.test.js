/* global describe, test, expect, beforeEach */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';
import provideLayout from '../provideLayout';

describe('provideLayout', () => {
  let Layout = null;
  let props = null;

  describe('viewProps', () => {
    const createCheck = (message, expected) => (checkProps) => {
      Object.entries(expected).forEach(([prop, expectation]) => {
        expect(checkProps[prop]).toBe(expectation);
      });

      return (
        <View {...checkProps}>
          <Text>{message}</Text>
        </View>
      );
    };

    beforeEach(() => {
      props = {
        DoNotUse: 'abc',
        name: 'Bob',
        id: 'def',
      };
    });

    test('that unused props are passed through', () => {
      const CheckComponent = createCheck('Unused passed through', props);
      Layout = provideLayout(CheckComponent);

      const tree = renderer.create(<Layout {...props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    test('that viewProps are spread through', () => {
      const CheckComponent = createCheck('ViewProps passed through', props);
      Layout = provideLayout(CheckComponent);

      const tree = renderer.create(<Layout viewProps={props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    test('that viewProps take precedence over pass through props', () => {
      const CheckComponent = createCheck('ViewProps took precendence over passed through', props);
      Layout = provideLayout(CheckComponent);

      const tree = renderer.create(<Layout DoNotUse="ghi" viewProps={props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('style', () => {
    const createCheck = (message, expected) => (checkProps) => {
      const styles = StyleSheet.flatten(checkProps.style);

      Object.entries(expected).forEach(([style, expectation]) => {
        expect(styles[style]).toBe(expectation);
      });

      return (
        <View {...checkProps} style={styles}>
          <Text>{message}</Text>
        </View>
      );
    };

    beforeEach(() => {
      props = {
        backgroundColor: 'red',
        marginTop: 10,
        paddingBottom: 20,
      };
    });

    test('that style is not ignored', () => {
      const CheckComponent = createCheck('Styles are used', props);
      Layout = provideLayout(CheckComponent);

      const tree = renderer.create(<Layout style={props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    test('that viewProps.style is not ignored', () => {
      const CheckComponent = createCheck('ViewProps.styles are used', props);
      Layout = provideLayout(CheckComponent);

      const tree = renderer.create(<Layout viewProps={{ style: props }} />).toJSON();

      expect(tree).toMatchSnapshot();
    });

    test('that hierarchy for styles go: viewProps.style > style > layoutProps', () => {
      const expected = {
        marginTop: 1,
        marginBottom: 2,
        marginLeft: 3,
        marginRight: 4,
      };
      const CheckComponent = createCheck('Hierarchy checks out', expected);
      Layout = provideLayout(CheckComponent);
      props = {
        margin: [1, 1, 1, 1],
        style: {
          marginBottom: 2,
          marginLeft: 2,
        },
        viewProps: {
          style: {
            marginLeft: 3,
            marginRight: 4,
          },
        },
      };

      const tree = renderer.create(<Layout {...props} />).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('calculate layout', () => {
    let instance = null;

    beforeEach(() => {
      Layout = provideLayout();
      instance = new Layout({});
    });

    describe('flex', () => {
      test('the value of flex in props is returned', () => {
        expect(instance.flex).toBe(undefined);

        instance.props.flex = -1;
        expect(instance.flex).toBe(-1);

        instance.props.flex = 3;
        expect(instance.flex).toBe(3);
      });

      test('boolean is converted to number', () => {
        instance.props.flex = true;
        expect(instance.flex).toBe(1);

        instance.props.flex = false;
        expect(instance.flex).toBe(0);
      });
    });

    describe('flexDirection', () => {
      test('if no row or col selected then returns null', () => {
        instance.props.row = false;
        instance.props.col = false;
        expect(instance.flexDirection).toBe(null);
      });

      test('if row is selected with or without reverse', () => {
        instance.props.row = true;
        expect(instance.flexDirection).toBe('row');

        instance.props.reverse = true;
        expect(instance.flexDirection).toBe('row-reverse');
      });

      test('if col is selected with or without reverse', () => {
        instance.props.col = true;
        expect(instance.flexDirection).toBe('column');

        instance.props.reverse = true;
        expect(instance.flexDirection).toBe('column-reverse');
      });

      test('if both are selected', () => {
        instance.props.row = true;
        instance.props.col = true;
        expect(instance.flexDirection).toBe('row');
      });
    });

    describe('margins', () => {
      test('provide margin properties', () => {
        instance.props.margin = 1;
        expect(instance.margins).toEqual({ margin: 1 });

        instance.props.margin = [1];
        expect(instance.margins).toEqual({ margin: 1 });

        instance.props.margin = [1, 5];
        expect(instance.margins).toEqual({
          marginTop: 1,
          marginBottom: 1,
          marginLeft: 5,
          marginRight: 5,
        });
      });
    });

    describe('paddings', () => {
      test('provide padding properties', () => {
        instance.props.padding = 3;
        expect(instance.paddings).toEqual({ padding: 3 });

        instance.props.padding = [3];
        expect(instance.paddings).toEqual({ padding: 3 });

        instance.props.padding = [7, 2, 8];
        expect(instance.paddings).toEqual({
          paddingTop: 7,
          paddingBottom: 8,
          paddingLeft: 2,
          paddingRight: 2,
        });
      });
    });
  });
});
