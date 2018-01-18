# Layout library for react-native

This library is inspired by [styled-components](https://www.styled-components.com/docs/basics#react-native) and [react-native-row](https://github.com/hyrwork/react-native-row), so thank you to the contributors and maintainers of those libraries.

A layout library for react native to help position components cleanly and in an expressive way.
Layit offers many of the powerful layout properties which `react-native-row` offers while additionally allowing the flexibility of applying these properties onto your predefined components.
Layout should be expressive and clear at a glance, it doesn't help that most of the time layout is mixed with other styles like colour and animations making discovery for them non-obvious.

Following the philosophy of `react-native-row`, this library helps keep unnecessary stylesheet declarations that are involved with layout and position.

# Layit

## Installation

```bash
npm install react-native-layit
```

or

```bash
yarn add react-native-layit
```

## Basic Usage

```js
import React from 'react';
import { Text } from 'react-native';
import { provideLayout } from 'react-native-layit';

const View = provideLayout();

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
  <View>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </View>
);
```

But wait... couldn't I get the same by importing `View` from `react-native`?

Why yes you can! `provideLayout()` acts as wrapper which tries to be as un-intrusive as possible.
It can also be used as a Higher-order component.

Now, let's get to what this library is for.

Say we wanted things to align horizontally instead of vertically, we can do this without the library.

```js
export default () => (
  <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 10, marginBottom: 5, marginRight: 20 }}>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </View>
);
```

or with `provideLayout()`.

```js
export default () => (
  <View row margin={[20, 20, 5, 10]}>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </View>
);
```

The layout (I've included `margin` and `padding` as "layout") styles are props and can be utilised cleanly without the need to mangle with the `style` prop.

The style prop is passed through as it is normally, so you can use as much of the API available as you feel comfortable.
The style prop will override the layout props, if both are defined.

```js
export default () => (
  <View style={{ flexDirection: 'column' }} row margin={[20, 20, 5, 10]}>
    <Box style={{ backgroundColor: 'red' }} />
    <Box style={{ backgroundColor: 'blue' }} />
    <Box style={{ backgroundColor: 'green' }} />
  </View>
);
```

So the above will use `column` instead of `row` defined

## Wrapping other components

As mentioned earlier, `provideLayout()` can be used as a Higher-order component, that means it's easy to use another component instead of `View` from `react-native`.

Perhaps you have a button that has been styled with `styled-components`, or a panel which has some default padding, use `provideLayout()` to wrap those components.

```js
export default provideLayout(SuccessButtonComponent);
```

Any style or layout props used will override the button's style.
So that means if `SuccessButtonComponent` has a `flexDirection: 'column'` and you use the `row` property, the button will have `flexDirection: 'row'` in the end.

## Layout properties

Here is a list of available props for the layout

| Prop | Type | Default | Description |
| --- | :---: | :---: | --- |
| row | boolean/number | false | Sets style `flexDirection: 'row'`, this take precedence over the `col` prop below |
| col | boolean/number | false | Sets style `flexDirection: 'column'` |
| reverse | boolean | false | Reverses the direction of `row` or `col` making the style `flexDirection: 'row-reverse'` or `flexDirection: 'column-reverse'` respectively, so will need one of those enabled to work |
| flex | boolean/number | | Sets style `flex: ${number}`, will convert `false` to `0` and `true` to `1` |
| margin | number/array[number] | sets margin for top, bottom, left and right. Follows CSS rules for `margin` |
| padding | number/array[number] | sets padding for top, bottom, left and right. Follows CSS rules for `padding` |
| viewProps | object | `{}` | a set of props to pass on to the `Component` (default `View`), the layout passes through most props except ones listed in this table. So if you require any props already used by the layout, this prop is the way to declare them |

## Wrapper for styles

Included in this library is a simple Higher-order component which accepts some styles and applies that style to any wrapped components.

*NOTE*: This may get removed in future in favour of recommending other more suited style libraries.

Here's an example of turning all wrapped components green.

```js
import { provideStyles } from 'react-native-layit';
const turnGreen = provideStyles({ backgroundColor: 'green' });

const greenButton = turnGreen(Button);
const greenPanel = turnGreen(Panel);
```

It utilises `StyleSheet` internally, so performance wouldn't be a issue.

My original attempt started out with this kind of API.

```js
const SuccessButton = compose(
  provideLayout,
  provideStyles({ backgroundColor: 'green' }),
)(Button)
```

But then I realised that I could just focus on the `provideLayout()` API.

## License

[MIT](LICENSE)