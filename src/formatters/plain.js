const addedParse = ({ key }, parents) => `Property '${parents}${key}' was removed`;

const removedParse = ({ key, value }, parents) => {
  const complexValue = '[complex value]';
  const stringValue = typeof value === 'string' ? `'${value}'` : value;
  const complex = stringValue instanceof Object ? complexValue : stringValue;
  const str = `Property '${parents}${key}' was added with value: ${complex}`;
  return str;
};

const updatedParse = (element, parents, func) => {
  const {
    key, oldValue, newValue, children,
  } = element;
  if (children) {
    return func(children, `${parents}${key}.`);
  }
  const newOld = typeof oldValue === 'string' ? `'${oldValue}'` : oldValue;
  const newNew = typeof newValue === 'string' ? `'${newValue}'` : newValue;
  return `Property '${parents}${key}' was updated. From ${newOld} to ${newNew}`;
};

const render = (data) => {
  const iter = (obj, depth) => {
    const result = obj.map((element) => {
      const { nodeType } = element;
      switch (nodeType) {
        case 'added':
          return addedParse(element, depth);
        case 'removed':
          return removedParse(element, depth);
        case 'updated': {
          return updatedParse(element, depth, iter);
        }
        default:
          throw new Error(`Unknown node type: ${nodeType}`);
      }
    }, []);
    return result.filter((e) => e.trim()).join('\n');
  };
  return iter(data, '');
};

export default render;
