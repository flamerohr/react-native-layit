import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View as RNView, ViewPropTypes } from 'react-native';
import { calculate, propTypes as gapsPropTypes } from './gapsHelper';

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
      viewProps: {},
    };

    get flexStyles() {
      const {
        flex,
        flexDirection,
      } = this;
      const flexStyles = {};

      if (flex !== null) {
        Object.assign(flexStyles, { flex });
      }

      if (flexDirection) {
        Object.assign(flexStyles, { flexDirection });
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

    get margins() {
      return calculate('margin', this.props.margin);
    }

    get paddings() {
      return calculate('padding', this.props.padding);
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
