import PropTypes from 'prop-types';

const sanitize = (amount) => {
  const numeric = Number(amount);

  if (!Number.isNaN(numeric)) {
    return numeric;
  }
  return amount;
};

export const calculate = (type, amount) => {
  if (type !== 'Width' && type !== 'Height') {
    throw new Error('Invalid type provided to `dimensionsHelper`: only accepts "Width" or "Height"');
  }
  const prop = type.toLocaleLowerCase();
  const dimensions = {};

  if (typeof amount === 'string' || typeof amount === 'number') {
    dimensions[prop] = sanitize(amount);
  }

  if (!Array.isArray(amount)) {
    return dimensions;
  }

  const [
    min,
    actual,
    max,
  ] = amount;

  if (typeof min === 'string' || typeof min === 'number') {
    dimensions[`min${type}`] = sanitize(min);
  }
  if (typeof actual === 'string' || typeof actual === 'number') {
    dimensions[prop] = sanitize(actual);
  }
  if (typeof max === 'string' || typeof max === 'number') {
    dimensions[`max${type}`] = sanitize(max);
  }

  return dimensions;
};

const measurement = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

export const propTypes = PropTypes.oneOfType([
  measurement,
  PropTypes.arrayOf(measurement),
]);
