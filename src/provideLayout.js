import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View as RNView, ViewPropTypes, StyleSheet } from 'react-native';
import hash from 'object-hash';
import { calculate as getGaps, propTypes as gapsPropTypes } from './gapsHelper';
import { calculate as getDimensions, propTypes as dimensionsPropTypes } from './dimensionsHelper';

const empty = {};

const alignProps = PropTypes.oneOf([
  'flex-start',
  'center',
  'flex-end',
  'space-around',
  'space-between',
  'space-evenly',
  'baseline',
  'stretch',
]);

let key = null;
let styles = {};

export const clearCache = () => {
  styles = {};
};

export default function provideLayout(View = RNView, styleIndexer = StyleSheet.create) {
  return class Layit extends PureComponent {
    static propTypes = {
      style: (View === RNView) ? ViewPropTypes.style : PropTypes.any,
      margin: gapsPropTypes,
      padding: gapsPropTypes,
      flex: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      row: PropTypes.bool,
      col: PropTypes.bool,
      reverse: PropTypes.bool,
      alignX: alignProps,
      alignY: alignProps,
      viewProps: PropTypes.object,
      cacheStyles: PropTypes.bool,
      width: dimensionsPropTypes,
      height: dimensionsPropTypes,
    };

    static defaultProps = {
      style: null,
      margin: null,
      padding: null,
      flex: null,
      row: false,
      col: false,
      reverse: false,
      alignX: null,
      alignY: null,
      viewProps: empty,
      cacheStyles: true,
      width: null,
      height: null,
    };

    get layout() {
      if (this.props.cacheStyles) {
        const { keyProps } = this;

        key = hash(keyProps);

        if (typeof styles[key] !== 'undefined') {
          return styles[key];
        }
      }

      const layout = {
        ...this.margins,
        ...this.paddings,
        ...this.flexStyles,
        ...this.heights,
        ...this.widths,
      };

      if (!this.props.cacheStyles) {
        return layout;
      }

      const newStyle = styleIndexer({
        layout,
      });

      styles = {
        ...styles,
        [key]: newStyle.layout,
      };
      return styles[key];
    }

    get keyProps() {
      return Object.keys(Layit.defaultProps).reduce((prev, prop) => {
        const value = this.props[prop];
        if (value === Layit.defaultProps[prop]) {
          return prev;
        }
        return {
          ...prev,
          [prop]: value,
        };
      }, {});
    }

    get heights() {
      return getDimensions('Height', this.props.height);
    }

    get widths() {
      return getDimensions('Width', this.props.width);
    }

    get flexStyles() {
      const {
        flex,
        flexDirection,
        justifyContent,
        alignItems,
      } = this;
      const flexStyles = {};

      if (flexDirection) {
        Object.assign(flexStyles, { flexDirection });
      }

      if (justifyContent) {
        Object.assign(flexStyles, { justifyContent });
      }

      if (alignItems) {
        Object.assign(flexStyles, { alignItems });
      }

      if (flex !== null && typeof flex !== 'undefined') {
        Object.assign(flexStyles, { flex });
      }

      return flexStyles;
    }

    get flex() {
      const { flex } = this.props;

      if (typeof flex === 'boolean') {
        return flex ? 1 : 0;
      }
      return flex;
    }

    get isRow() {
      const { row } = this.props;

      return row;
    }

    get isCol() {
      const { row, col } = this.props;

      // row takes precedence if both row and col are true
      return !row && col;
    }

    get flexDirection() {
      const { reverse } = this.props;
      const reversing = reverse ? '-reverse' : '';

      if (this.isRow) {
        return `row${reversing}`;
      }
      if (this.isCol) {
        return `column${reversing}`;
      }

      return null;
    }

    get justifyContent() {
      return this.getAlignment(true);
    }

    get alignItems() {
      return this.getAlignment(false);
    }

    get margins() {
      return getGaps('margin', this.props.margin);
    }

    get paddings() {
      return getGaps('padding', this.props.padding);
    }

    getAlignment(justified) {
      const {
        alignX,
        alignY,
      } = this.props;

      const unsupported = 'center';

      let alignProp = null;
      if ((this.isRow && justified) || (this.isCol && !justified)) {
        alignProp = alignX;
      }
      if ((this.isCol && justified) || (this.isRow && !justified)) {
        alignProp = alignY;
      }

      if (justified && ['stretch', 'baseline'].includes(alignProp)) {
        return unsupported;
      }

      if (!justified && ['space-around', 'space-between', 'space-evenly'].includes(alignProp)) {
        return unsupported;
      }

      return alignProp;
    }

    render() {
      const {
        style,
        viewProps,
        ...props
      } = this.props;

      const { layout } = this;

      // don't pass on layit props
      Object.keys(Layit.propTypes).forEach(name => delete props[name]);

      return <View {...props} {...viewProps} style={[layout, style, viewProps.style]} />;
    }
  };
}
