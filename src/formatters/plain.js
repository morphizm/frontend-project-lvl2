const removedText = (property) => `Property '${property}' was removed`;
const addedText = (property, value) => `Property '${property}' was added with value: ${value}`;
const changedText = (property, oldValue, newValue) => `Property '${property}' was updated. From ${oldValue} to ${newValue}`;

const stringify = (value) => {
  if (value instanceof Object) {
    return '[complex value]';
  }
  return typeof value === 'string' ? `'${value}'` : value;
};

const render = (data) => {
  const iter = (obj, depth) => {
    const result = obj.map((element) => {
      const {
        nodeType, key, oldValue, newValue, children, value,
      } = element;
      switch (nodeType) {
        case 'added': {
          const stringValue = stringify(value);
          return addedText(`${depth}${key}`, stringValue);
        }
        case 'removed':
          return removedText(`${depth}${key}`);
        case 'nested': {
          return iter(children, `${depth}${key}.`);
        }
        case 'changed': {
          const stringOldValue = stringify(oldValue);
          const stringNewValue = stringify(newValue);
          return changedText(`${depth}${key}`, stringOldValue, stringNewValue);
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
