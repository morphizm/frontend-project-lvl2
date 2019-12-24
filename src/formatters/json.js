const parseForUpdated = (elem, func) => {
  const { value, children } = elem;
  const { oldValue, newValue } = value;
  if (children.length === 0) {
    return [oldValue, newValue];
  }
  return [func(children)];
};

const render = (data) => data.reduce((acc, element) => {
  const {
    action, key, value,
  } = element;
  switch (action) {
    case 'added':
      return { ...acc, [key]: [action, value] };
    case 'removed':
      return { ...acc, [key]: [action, value] };
    case 'updated': {
      const newAcc = [action, ...parseForUpdated(element, render)];
      return { ...acc, [key]: newAcc };
    }
    default:
      throw new Error('Unknown type');
  }
}, {});

export default (data) => JSON.stringify(render(data));
