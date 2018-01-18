import React, { PureComponent } from 'react';
import { StyleSheet, ViewPropTypes } from 'react-native';

export default function provideStyles(styles) {
  const styleSheet = (styles)
    ? StyleSheet.create({ styles }).styles
    : null;

  return (Styling) => {
    class WrappedStyles extends PureComponent {
      static propTypes = {
        style: ViewPropTypes.style,
      };

      static defaultProps = {
        style: null,
      };

      render() {
        const { style, ...props } = this.props;
        return (
          <Styling style={[styleSheet, style]} {...props} />
        );
      }
    }

    return WrappedStyles;
  };
}
