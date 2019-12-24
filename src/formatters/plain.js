const addedParse = ({ key }, parents) => `Property '${parents}${key}' was removed`;

const removedParse = ({ key, value }, parents) => {
  const complexValue = '[complex value]';
  const stringValue = typeof value === 'string' ? `'${value}'` : value;
  const complex = stringValue instanceof Object ? complexValue : stringValue;
  const str = `Property '${parents}${key}' was added with value: ${complex}`;
  return str;
};

const updatedParse = ({ key, value }, parents) => {
  const { oldValue, newValue } = value;
  const newOld = typeof oldValue === 'string' ? `'${oldValue}'` : oldValue;
  const newNew = typeof newValue === 'string' ? `'${newValue}'` : newValue;
  return `Property '${parents}${key}' was updated. From ${newOld} to ${newNew}`;
};

const render = (data) => {
  const iter = (obj, depth) => {
    const result = obj.map((element) => {
      const {
        key, children, action, childrenType,
      } = element;
      switch (action) {
        case 'added':
          return addedParse(element, depth);
        case 'removed':
          return removedParse(element, depth);
        case 'updated': {
          if (childrenType === 'plain') {
            return updatedParse(element, depth);
          }
          return iter(children, `${depth}${key}.`);
        }
        default:
          throw new Error('Unknow type');
      }
    }, []);
    return result.filter((e) => e.trim()).join('\n');
  };
  return iter(data, '');
};

export default render;
