const parseForUpdated = (elem, func) => {
  const {
    children, oldValue, newValue,
  } = elem;
  if (!children) {
    return [oldValue, newValue];
  }
  return [func(children)];
};

const render = (data) => {
  const iter = (items) => items.map((element) => {
    const {
      nodeType, key, value,
    } = element;
    switch (nodeType) {
      case 'added':
        return ({ [key]: [nodeType, value] });
      case 'removed':
        return ({ [key]: [nodeType, value] });
      case 'updated': {
        const newAcc = ([nodeType, parseForUpdated(element, iter)]);
        return ({ [key]: newAcc });
      }
      default:
        throw new Error(`Unknown node type: ${nodeType}`);
    }
  });
  const result = iter(data);
  return JSON.stringify(result);
};


export default render;
