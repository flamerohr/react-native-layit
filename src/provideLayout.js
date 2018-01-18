import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View as RNView, ViewPropTypes } from 'react-native';
import { calculate, propTypes as gapsPropTypes } from './gapsHelper';

export default function provideLayout(View = RNView) {
  return class Layit extends PureComponent {
    static propTypes = {
      style: ViewPropTypes.style,
      flex: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      margin: gapsPropTypes,
      padding: gapsPropTypes,
      row: PropTypes.bool,
      col: PropTypes.bool,
      reverse: PropTypes.bool,
      viewProps: PropTypes.object,
    };

    static defaultProps = {
      style: null,
      flex: null,
      row: false,
      col: false,
      reverse: false,
      margin: null,
      padding: null,
      viewProps: {},
    };

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
        flex,
        row,
        col,
        reverse,
        margin,
        padding,
        viewProps,
        ...props
      } = this.props;

      const layout = {};

      if (margin) {
        Object.assign(layout, this.margins);
      }

      if (padding) {
        Object.assign(layout, this.paddings);
      }

      if (flex !== null) {
        layout.flex = this.flex;
      }

      if (row || col) {
        layout.flexDirection = this.flexDirection;
      }

      return <View {...props} {...viewProps} style={[layout, style, viewProps.style]} />;
    }
  };
}
