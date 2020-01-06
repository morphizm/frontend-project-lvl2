const removedText = (property) => `Property '${property}' was removed`;
const addedText = (property, value) => `Property '${property}' was added with value: ${value}`;
const nestedText = (property, oldValue, newValue) => `Property '${property}' was updated. From ${oldValue} to ${newValue}`;

const addedParse = ({ key, value }, parents) => {
  const complexValue = '[complex value]';
  const stringValue = typeof value === 'string' ? `'${value}'` : value;
  const complex = stringValue instanceof Object ? complexValue : stringValue;
  return addedText(`${parents}${key}`, complex);
};

const removedParse = ({ key }, parents) => removedText(`${parents}${key}`);

const updatedParse = (element, parents, func) => {
  const {
    key, children,
  } = element;
  return func(children, `${parents}${key}.`);
};

const nestedParse = (element, parents) => {
  const {
    key, oldValue, newValue,
  } = element;
  const newOld = typeof oldValue === 'string' ? `'${oldValue}'` : oldValue;
  const newNew = typeof newValue === 'string' ? `'${newValue}'` : newValue;
  return nestedText(`${parents}${key}`, newOld, newNew);
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
        case 'nested': {
          return nestedParse(element, depth);
        }
        case 'identical':
          return null;
        default:
          throw new Error(`Unknown node type: ${nodeType}`);
      }
    }, []);
    return result.join('\n');
  };
  return iter(data, '');
};

export default render;
