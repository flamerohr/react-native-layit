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
      dial: PropTypes.number,
      spaceAround: PropTypes.bool,
      spaceBetween: PropTypes.bool,
      stretch: PropTypes.bool,
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
      dial: null,
      spaceAround: false,
      spaceBetween: false,
      stretch: false,
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

      if (flex !== null) {
        Object.assign(flexStyles, { flex });
      }

      if (flexDirection) {
        Object.assign(flexStyles, { flexDirection });
      }

      if (justifyContent) {
        Object.assign(flexStyles, { justifyContent });
      }

      if (alignItems) {
        Object.assign(flexStyles, { alignItems });
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
      const { row, spaceAround, spaceBetween } = this.props;

      if (spaceAround) {
        return 'space-around';
      }
      if (spaceBetween) {
        return 'space-between';
      }
      if (!this.validDial) {
        return null;
      }

      return this.offset(row);
    }

    get alignItems() {
      const { col, stretch } = this.props;

      if (stretch) {
        return 'stretch';
      }
      if (!this.validDial) {
        return null;
      }

      return this.offset(col);
    }

    get validDial() {
      const {
        row,
        col,
        dial,
      } = this.props;

      return (
        // needs a direction
        (row || col) &&
        // needs a placement
        (dial && dial <= 9 && dial >= 1)
      );
    }

    get margins() {
      return calculate('margin', this.props.margin);
    }

    get paddings() {
      return calculate('padding', this.props.padding);
    }

    offset(horizontal) {
      const { dial } = this.props;
      const index = horizontal ? dial % 3 : Math.floor(dial / 3);

      if (index === 0) {
        return 'flex-end';
      }
      if (index === 1) {
        return 'flex-start';
      }
      return 'center';
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
        dial,
        spaceAround,
        spaceBetween,
        stretch,
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
