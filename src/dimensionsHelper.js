import PropTypes from 'prop-types';

export const calculate = (type, amount) => {
  if (type !== 'Width' && type !== 'Height') {
    throw new Error('Invalid type provided to `dimensionsHelper`: only accepts "Width" or "Height"');
  }
  const prop = type.toLocaleLowerCase();
  const dimensions = {};

  if (typeof amount === 'string' || typeof amount === 'number') {
    dimensions[prop] = amount;
  }

  if (!Array.isArray(amount)) {
    return dimensions;
  }

  if (typeof amount[0] === 'string' || typeof amount[0] === 'number') {
    dimensions[`min${type}`] = amount[0];
  }
  if (typeof amount[1] === 'string' || typeof amount[1] === 'number') {
    dimensions[prop] = amount[1];
  }
  if (typeof amount[2] === 'string' || typeof amount[2] === 'number') {
    dimensions[`max${type}`] = amount[2];
  }

  return dimensions;
};

const measurement = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

export const propTypes = PropTypes.oneOfType([
  measurement,
  PropTypes.arrayOf(measurement),
]);
