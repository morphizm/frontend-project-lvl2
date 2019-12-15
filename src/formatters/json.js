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
  if (action !== 'updated') {
    const newAcc = [action, value];
    return { ...acc, [key]: newAcc };
  }
  const newAcc = [action, ...parseForUpdated(element, render)];
  return { ...acc, [key]: newAcc };
}, {});

export default render;
