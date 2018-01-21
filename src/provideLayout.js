import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View as RNView, ViewPropTypes } from 'react-native';
import { calculate, propTypes as gapsPropTypes } from './gapsHelper';

const alignProps = PropTypes.oneOf([
  'flex-start',
  'center',
  'flex-end',
  'space-around',
  'space-between',
  'stretch',
]);

export default function provideLayout(View = RNView) {
  return class Layit extends PureComponent {
    static propTypes = {
      style: ViewPropTypes.style,
      margin: gapsPropTypes,
      padding: gapsPropTypes,
      flex: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      row: PropTypes.bool,
      col: PropTypes.bool,
      reverse: PropTypes.bool,
      alignX: alignProps,
      alignY: alignProps,
      viewProps: PropTypes.object,
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
    };

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

      if (flex !== null) {
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
        margin,
        padding,
        flex,
        row,
        col,
        reverse,
        alignX,
        alignY,
        viewProps,
        ...props
      } = this.props;

      const layout = {
        ...this.margins,
        ...this.paddings,
        ...this.flexStyles,
      };

      return <View {...props} {...viewProps} style={[layout, style, viewProps.style]} />;
    }
  };
}
