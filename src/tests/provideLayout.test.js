/* global jest, describe, test, expect, beforeEach */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import renderer from 'react-test-renderer';
import hash from 'object-hash';
import provideLayout, { clearCache } from '../provideLayout';

describe('provideLayout', () => {
  let Layout = null;
  let props = null;

  beforeEach(() => {
    clearCache();
  });

  describe('clearCache', () => {
    let mockStyleIndexer = null;

    beforeEach(() => {
      mockStyleIndexer = jest.fn(styles => styles);
      Layout = provideLayout(View, mockStyleIndexer);
    });

    test('clearing cache causes style indexer to be called again', () => {
      /* eslint-disable no-unused-expressions */
      const instance = new Layout({ row: true, cacheStyles: true });
      instance.layout;
      instance.layout;

      expect(mockStyleIndexer).toBeCalled();
      expect(mockStyleIndexer.mock.calls.length).toBe(1);

      clearCache();

      instance.layout;

      expect(mockStyleIndexer.mock.calls.length).toBe(2);

      instance.layout;
      instance.layout;
      instance.layout;

      expect(mockStyleIndexer.mock.calls.length).toBe(2);
      /* eslint-enable no-unused-expressions */
    });
  });

  describe('layout', () => {
    const mockStyleIndexer = (styles) => Object
      .entries(styles)
      .reduce((prev, [key, value]) => ({
        ...prev,
        // generate a unique id similar to how StyleSheet.create does - but not an integer
        [key]: `hashed:${hash(value)}`,
      }), {});

    beforeEach(() => {
      props = {
        row: true,
        alignY: 'center',
        cacheStyles: true,
      };
      Layout = provideLayout(View, mockStyleIndexer);
    });

    test('can bypass cache', () => {
      const cached = new Layout(props);

      const notCached = new Layout({
        ...props,
        cacheStyles: false,
      });

      expect(cached.layout).not.toEqual(notCached.layout);
    });

    test('layout id should be cached and be the same for a set of styles', () => {
      const layout = new Layout(props);

      const anotherLayout = new Layout({
        ...props,
      });
      expect(anotherLayout.layout).toBe(layout.layout);

      const differentKeyLayout = new Layout({
        row: true,
        alignX: 'center',
        cacheStyles: true,
      });
      expect(differentKeyLayout.layout).not.toEqual(layout.layout);

      const differentValueLayout = new Layout({
        row: true,
        alignY: 'flex-start',
        cacheStyles: true,
      });
      expect(differentValueLayout.layout).not.toEqual(layout.layout);
    });
  });

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

  describe('dimensions', () => {
    let instance = null;
    const reset = () => {
      Layout = provideLayout();
      instance = new Layout({});
    };

    beforeEach(reset);

    describe('widths', () => {
      test('should be empty by default', () => {
        expect(instance.widths).toEqual({});
      });

      test('should provide the width in the props', () => {
        instance.props.width = '50%';
        expect(instance.widths).toEqual({ width: '50%' });
      });

      test('should provide min and max when array is given', () => {
        instance.props.width = [10, null, 25];
        expect(instance.widths).toEqual({ minWidth: 10, maxWidth: 25 });
      });
    });

    describe('heights', () => {
      test('should be empty by default', () => {
        expect(instance.heights).toEqual({});
      });

      test('should provide the height in the props', () => {
        instance.props.height = 40;
        expect(instance.heights).toEqual({ height: 40 });
      });

      test('should provide min and max when array is given', () => {
        instance.props.height = [10, null, 25];
        expect(instance.heights).toEqual({ minHeight: 10, maxHeight: 25 });
      });
    });
  });

  describe('gaps', () => {
    let instance = null;
    const reset = () => {
      Layout = provideLayout();
      instance = new Layout({});
    };

    beforeEach(reset);

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

  describe('flexStyles', () => {
    let instance = null;
    const reset = () => {
      Layout = provideLayout();
      instance = new Layout({});
    };

    beforeEach(reset);

    test('should be empty by default', () => {
      expect(instance.flexStyles).toEqual({});
    });

    test('should provide the style when it is in the props', () => {
      instance.props.flex = 1;
      expect(instance.flexStyles).toEqual({ flex: 1 });

      reset();
      instance.props.row = true;
      expect(instance.flexStyles).toEqual({ flexDirection: 'row' });

      reset();
      instance.props.row = true;
      instance.props.alignX = 'center';
      expect(instance.flexStyles).toEqual({ flexDirection: 'row', justifyContent: 'center' });

      reset();
      instance.props.row = true;
      instance.props.alignY = 'center';
      expect(instance.flexStyles).toEqual({ flexDirection: 'row', alignItems: 'center' });
    });

    describe('flex', () => {
      test('the value of flex in props is returned', () => {
        expect(instance.flex).toBe(undefined);

        instance.props.flex = null;
        expect(instance.flex).toBe(null);

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

    describe('isCol', () => {
      test('the col prop value is given', () => {
        instance.props.col = true;
        expect(instance.isCol).toBe(true);
      });

      test('the row prop takes precendence', () => {
        instance.props.row = true;
        instance.props.col = true;
        expect(instance.isCol).toBe(false);
      });
    });

    describe('isRow', () => {
      test('the row prop value is given', () => {
        instance.props.row = true;
        expect(instance.isRow).toBe(true);
      });

      test('the row prop takes precendence', () => {
        instance.props.row = true;
        instance.props.col = true;
        expect(instance.isRow).toBe(true);
      });
    });

    describe('justifyContent', () => {
      test('nothing is returned when both `row` and `col` are false', () => {
        instance.props.row = false;
        instance.props.col = false;
        instance.props.alignX = 'flex-start';

        expect(instance.justifyContent).toBe(null);
      });

      test('align value is returned when `row` and `alignX`', () => {
        instance.props.row = true;
        instance.props.alignX = 'space-around';

        expect(instance.justifyContent).toBe('space-around');
      });

      test('align value is returned when `col` and `alignY`', () => {
        instance.props.col = true;
        instance.props.alignY = 'flex-end';

        expect(instance.justifyContent).toBe('flex-end');
      });

      test('row takes precedence', () => {
        instance.props.row = true;
        instance.props.col = true;
        instance.props.alignX = 'flex-start';

        expect(instance.justifyContent).toBe('flex-start');
      });

      test('invalid justifyContent value fallsback to center', () => {
        instance.props.row = true;
        instance.props.alignX = 'stretch';

        expect(instance.justifyContent).toBe('center');
      });
    });

    describe('alignItems', () => {
      test('nothing is returned when both `row` and `col` are false', () => {
        instance.props.row = false;
        instance.props.col = false;
        instance.props.alignY = 'flex-start';

        expect(instance.justifyContent).toBe(null);
      });

      test('align value is returned when `row` and `alignY`', () => {
        instance.props.row = true;
        instance.props.alignY = 'stretch';

        expect(instance.alignItems).toBe('stretch');
      });

      test('align value is returned when `col` and `alignX`', () => {
        instance.props.col = true;
        instance.props.alignX = 'flex-end';

        expect(instance.alignItems).toBe('flex-end');
      });

      test('row takes precedence', () => {
        instance.props.row = true;
        instance.props.col = true;
        instance.props.alignY = 'flex-start';

        expect(instance.alignItems).toBe('flex-start');
      });

      test('invalid alignItems value fallsback to center', () => {
        instance.props.row = true;
        instance.props.alignY = 'space-around';

        expect(instance.alignItems).toBe('center');

        instance.props.alignY = 'space-between';

        expect(instance.alignItems).toBe('center');
      });
    });
  });
});
