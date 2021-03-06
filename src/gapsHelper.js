import PropTypes from 'prop-types';

export const calculate = (type, value) => {
  if (type !== 'margin' && type !== 'padding') {
    throw new Error('Invalid type provided to `calculateGaps`: only accepts "margin" or "padding"');
  }
  if (typeof value === 'number' || typeof value === 'string') {
    const gap = Number(value || 0);
    if (Number.isNaN(gap)) {
      return {};
    }
    return {
      [type]: gap,
    };
  }

  if (!Array.isArray(value)) {
    return {};
  }

  const filtered = value.map(item => Number(item || 0));

  if (filtered.length === 0 ||
    filtered.length > 4 ||
    filtered.findIndex(item => Number.isNaN(item)) !== -1
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
  PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
]);
