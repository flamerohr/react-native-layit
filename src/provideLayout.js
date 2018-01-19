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
      xAlign: alignProps,
      yAlign: alignProps,
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
      xAlign: null,
      yAlign: null,
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
      } else if (justifyContent && alignItems) {
        Object.assign(flexStyles, { flex: 1 });
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

    get flexDirection() {
      const { row, col, reverse } = this.props;
      const reversing = reverse ? '-reverse' : '';

      if (row) {
        return `row${reversing}`;
      }
      if (col) {
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
        row,
        col,
        xAlign,
        yAlign,
      } = this.props;

      if (!row && !col) {
        return null;
      }

      const alignProp = (row === justified) ? xAlign : yAlign;
      const unsupported = 'center';

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
        xAlign,
        yAlign,
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
