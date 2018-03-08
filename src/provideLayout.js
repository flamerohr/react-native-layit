import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View as RNView, ViewPropTypes, StyleSheet } from 'react-native';
import { calculate, propTypes as gapsPropTypes } from './gapsHelper';
import hash from 'object-hash';

const alignProps = PropTypes.oneOf([
  'flex-start',
  'center',
  'flex-end',
  'space-around',
  'space-between',
  'stretch',
]);

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
      viewProps: {},
      cacheStyles: true,
    };

    get layout() {
      const layout = {
        ...this.margins,
        ...this.paddings,
        ...this.flexStyles,
      };

      if (!this.props.cacheStyles) {
        return layout;
      }
      const key = hash(layout);

      if (!styles[key]) {
        newStyle = styleIndexer({
          layout,
        });

        styles = {
          ...styles,
          [key]: newStyle.layout,
        };
      }

      return styles[key];
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
      return calculate('margin', this.props.margin);
    }

    get paddings() {
      return calculate('padding', this.props.padding);
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

      if (justified && ['stretch'].includes(alignProp)) {
        return unsupported;
      }

      if (!justified && ['space-around', 'space-between'].includes(alignProp)) {
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

      const layout = this.layout;

      // don't pass on layit props
      Object.keys(Layit.propTypes).forEach(name => delete props[name]);

      return <View {...props} {...viewProps} style={[layout, style, viewProps.style]} />;
    }
  };
}
