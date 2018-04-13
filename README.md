# Layit - Layout library for react-native

[![npm version](https://badge.fury.io/js/react-native-layit.svg)](https://badge.fury.io/js/react-native-layit)
[![Build Status](https://travis-ci.org/flamerohr/react-native-layit.svg?branch=master)](https://travis-ci.org/flamerohr/react-native-layit)
[![codecov](https://codecov.io/gh/flamerohr/react-native-layit/branch/master/graph/badge.svg)](https://codecov.io/gh/flamerohr/react-native-layit)

This library is inspired by [styled-components](https://www.styled-components.com/docs/basics#react-native) and [react-native-row](https://github.com/hyrwork/react-native-row), so thank you to the contributors and maintainers of those libraries.

Layit is a layout library for react native to help position components cleanly and in an expressive way.

Layit offers many of the powerful layout properties which `react-native-row` offers while additionally allowing the flexibility of applying these properties onto your predefined components.

Layout should be expressive and clear at a glance, it doesn't help that most of the time layout is mixed with other styles like colour and animations making discovery for them non-obvious.

Following the philosophy of `react-native-row`, this library helps keep unnecessary stylesheet declarations that are involved with layout and position.

## Installation

```bash
npm install react-native-layit
```

or

```bash
yarn add react-native-layit
```

## Basic Usage

```jsx
import React from 'react';
import { View, Text } from 'react-native';
import Layit from 'react-native-layit';

const Box = ({ style }) => (
  <View style={[
    {
      width: 50,
      height: 50
    },
    style
  ]}>
);

export default () => (
  <Layit>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </Layit>
);
```

But wait... couldn't I get the same by importing `View` from `react-native`? I don't see anything different.

Why yes you can! The `Layit` component acts as wrapper for `View` and tries to be as un-intrusive as possible.
There is also a Higher-order component available for wrapping other component types.

Now, let's get to what this library is for.

Say we wanted things to align horizontally instead of vertically, we can do this without `Layit`.

```jsx
export default () => (
  <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginBottom: 5, marginRight: 20 }}>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </View>
);
```

or with `Layit`.

```jsx
export default () => (
  <Layit row margin={[20, 20, 5, 10]}>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </Layit>
);
```

The layout styles are props and can be utilised cleanly without the need to mangle with the `style` prop.

The style prop will pass through and applied normally, so you can use as much of the API available as you feel comfortable.
The style prop will override the layout props, if both are defined. So becareful.

```jsx
export default () => (
  <View style={{ flexDirection: 'column' }} row margin={[20, 20, 5, 10]}>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </View>
);
```

The above will use `column` instead of `row` for `flexDirection` in the end. If you'd like style prop to be overridden by the layout props continue reading.

## Applying to other components

As mentioned earlier, there is also a Higher-order component available, that means it's easy to use another component instead of `View`.

Perhaps you have a button that has been styled with `styled-components`, or a panel which has some default padding, use `provideLayout()` to wrap those components.

```js
import { provideLayout } from 'react-native-layit';

export default provideLayout(SuccessButtonComponent);
```

Any style or layout props used will be passed to `SuccessButtonComponent` through the `style` prop. You'll need to make sure it is continued down the child component you wish the layout props to be applied to.

For example below.

```jsx
const SuccessButtonComponent = (props) => {
  const myStyles = {
    // style logic here
    flexDirection: 'column',
    backgroundColor: 'green',
  };
  return (
    <View style={[myStyles, props.style]}>
      <Text>It's a success!</Text>
      <Text>Lets have fun.</Text>
    </View>
  );
};
```

The example has the `style` prop provided take precendence over its own defined style, that means the `flexDirection: 'column'` could be changed to to `flexDirection: 'row'` by using the `row` property.

You could have it the other way round, but only it cases where you don't want any specific property to change, so if it was flipped in the example to `[props.style, myStyles]` then `SuccessButtonComponent` will always have `flexDirection: 'column'` even if the `row` property was used.

## Layout properties

Here is a list of available props for the layout

| Prop          |         Type         | Default | Description |
| ------------- | :------------------: | :-----: | ----------- |
| `flex`        |    boolean/number    |         | Sets style `flex: ${number}`, will convert `false` to `0` and `true` to `1` |
| `row`         |    boolean/number    | `false` | Sets style `flexDirection: 'row'`, this take precedence over the `col` prop if both are `true` |
| `col`         |    boolean/number    | `false` | Sets style `flexDirection: 'column'` |
| `reverse`     |        boolean       | `false` | Reverses the direction of `row` or `col` making the style `flexDirection: 'row-reverse'` or `flexDirection: 'column-reverse'` respectively, so will need one of those enabled to work |
| `alignX`      |         enum         |         | Sets either `justifyContent` for `row` or `alignItems` for `col` with the enum value. If neither `row` or `col` is defined this prop will not take effect |
| `alignY`      |         enum         |         | Same with `alignX` but sets `justifyContent` for col or `alignItems` for `row` |
| `width`       |        number        |         | Set the width, could interfer with `flex` behaviours if used together |
| `height`      |        number        |         | Set the height, could interfer with `flex` behaviours if used together |
| `margin`      | number/array[number] |         | Sets margin for top, bottom, left and right. Follows CSS rules for `margin` |
| `padding`     | number/array[number] |         | Sets padding for top, bottom, left and right. Follows CSS rules for `padding` |
| `viewProps`   |        object        |   `{}`  | A set of props to pass on to the `Component` (default `View`), the layout passes through most props except ones listed in this table. So if you require any props already used by the layout, this prop is the way to declare them. Props declared here take precedence over "pass through" props |
| `cacheStyles` |        boolean       |  `true` | Disables style cache, this could improve performance if you're doing rapid style changes through Layit, although it really depends on whether hashing an object or sending manual styles through is more performant, and also if you're going to re-use any of the styles that you're rapidly changing again. Your mileage may vary |

### Using `alignX` and `alignY`

 Here is a table for reference when an enum value is invalid in which case `center` is used instead.

 Important to note again that if neither `row` or `col` is defined these props will not take effect, that's because the library cannot tell which direction the flex is running otherwise.

| enum values     |  `row`+`alignX` |  `row`+`alignY` |  `col`+`alignX` |  `col`+`alignY` |
| --------------- | :-------------: | :-------------: | :-------------: | :-------------: |
| `flex-start`    |                 |                 |                 |                 |
| `center`        |                 |                 |                 |                 |
| `flex-end`      |                 |                 |                 |                 |
| `space-around`  |                 | :no_entry_sign: | :no_entry_sign: |                 |
| `space-between` |                 | :no_entry_sign: | :no_entry_sign: |                 |
| `stretch`       | :no_entry_sign: |                 |                 | :no_entry_sign: |

### Using `margin` and `padding`

Here is a table for what styles are applied when you use the `margin` and/or `padding`.

This behaves like the CSS rules, so if you're familiar with that, you probably already understand how it works.

| values           | `top` | `bottom` | `left` | `right` |
| ---------------- | :---: | :------: | :----: | :-----: |
| 12               |   12  |    12    |   12   |    12   |
| [12]             |   12  |    12    |   12   |    12   |
| [12, 24]         |   12  |    12    |   24   |    24   |
| [12, 24, 36]     |   12  |    36    |   24   |    24   |
| [12, 24, 36, 48] |   12  |    36    |   48   |    24   |

## Styles take precedence

If there's a `style` prop which has a rule conflicting with a layout prop, the style will take precendence. This also applies for `viewProps`, if viewProps contains a style property and there's also a style prop, the viewProps style will take precedence.

So the hierarchy goes like this
```
 viewProps.style > style > layoutProps
```

In order to not have styles overwriting the layoutProps, you should look at shifting those styles into another component which is wrapped by `provideLayout()`. Try to keep `provideLayout()` at the very top of the stack of wrappers, if possible.

This behaviour is to allow switching between different stylesheets seemlessly for a component without unexpected "it's not changing" scenarios and worrying about overwrites from this library.

For example

```js
const props = {
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
```

Will produce the following styles

```js
const flattenedStyles = {
  marginTop: 1,
  marginBottom: 2,
  marginLeft: 3,
  marginRight: 4,
};
```

## Pipeline

- Positioning props
- Maybe a modal provider?

## License

[MIT](LICENSE)