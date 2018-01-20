# Layit - Layout library for react-native

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

| Prop | Type | Default | Description |
| --- | :---: | :---: | --- |
| row | boolean/number | false | Sets style `flexDirection: 'row'`, this take precedence over the `col` prop below |
| col | boolean/number | false | Sets style `flexDirection: 'column'` |
| reverse | boolean | false | Reverses the direction of `row` or `col` making the style `flexDirection: 'row-reverse'` or `flexDirection: 'column-reverse'` respectively, so will need one of those enabled to work |
| flex | boolean/number | | Sets style `flex: ${number}`, will convert `false` to `0` and `true` to `1` |
| margin | number/array[number] | | Sets margin for top, bottom, left and right. Follows CSS rules for `margin` |
| padding | number/array[number] | | Sets padding for top, bottom, left and right. Follows CSS rules for `padding` |
| viewProps | object | `{}` | A set of props to pass on to the `Component` (default `View`), the layout passes through most props except ones listed in this table. So if you require any props already used by the layout, this prop is the way to declare them. Props declared here take precedence over "pass through" props |

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

## Pipeline

- Positioning props
- Investigate caching for the styles generated by the layout props, or use of `StyleSheet.create()`
- Remove `provideStyles()` possibly
- Maybe a modal provider?

## License

[MIT](LICENSE)