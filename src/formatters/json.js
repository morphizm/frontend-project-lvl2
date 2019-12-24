const parseForUpdated = (elem, func) => {
  const { value, children } = elem;
  const { oldValue, newValue } = value;
  if (children.length === 0) {
    return `["${oldValue}","${newValue}"]`;
  }
  return [func(children)];
};

const parse = (elem) => {
  if (!(elem instanceof Object)) {
    return `${elem}`;
  }
  const str = Object.entries(elem).map(([key, value]) => `"${key}":"${value}",`);
  return `{${str.join(' ')}}`;
};

const render = (data) => {
  const iter = (items) => items.map((element) => {
    const {
      action, key, value,
    } = element;
    switch (action) {
      case 'added':
        return `{"${key}":["${action}","${parse(value)}"]}`;
      case 'removed':
        return `{"${key}":["${action}","${parse(value)}"]}`;
      case 'updated': {
        const newAcc = `["${action}","${parseForUpdated(element, iter)}"]`;
        return `{"${key}":"${newAcc}"}`;
      }
      default:
        throw new Error('Unknown type');
    }
  });
  const result = iter(data);
  return `[${result}]`;
};


export default render;
