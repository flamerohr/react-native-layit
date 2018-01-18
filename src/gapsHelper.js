import PropTypes from 'prop-types';

export const calculate = (type, value) => {
  if (type !== 'margin' && type !== 'padding') {
    throw new Error('Invalid type provided to `calculateGaps`: only accepts "margin" or "padding"');
  }
  if (typeof value === 'number') {
    return {
      [type]: value,
    };
  }

  if (!Array.isArray(value)) {
    return {};
  }

  const filtered = value.map(item => item || 0);

  if (filtered.length === 0 ||
    filtered.find(item => typeof item !== 'number') ||
    filtered.length > 4
  ) {
    return {};
  }

  if (filtered.length === 1) {
    return {
      [type]: filtered[0],
    };
  }

  const gaps = {
    [`${type}Top`]: filtered[0],
    [`${type}Right`]: filtered[1],
    [`${type}Bottom`]: filtered.length === 2 ? filtered[0] : filtered[2],
    [`${type}Left`]: filtered.length < 4 ? filtered[1] : filtered[3],
  };

  return gaps;
};

export const propTypes = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.number),
]);
