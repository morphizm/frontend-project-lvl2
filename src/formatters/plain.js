const parse = (element, parents) => {
  const complexValue = '[complex value]';
  const {
    key, value, action,
  } = element;
  switch (action) {
    case 'added':
      return `Property '${parents}${key}' was removed`;
    case 'removed': {
      const stringValue = typeof value === 'string' ? `'${value}'` : value;
      const complex = stringValue instanceof Object ? complexValue : stringValue;
      const str = `Property '${parents}${key}' was added with value: ${complex}`;
      return str;
    }
    case 'updated': {
      const { oldValue, newValue } = value;
      const newOld = typeof oldValue === 'string' ? `'${oldValue}'` : oldValue;
      const newNew = typeof newValue === 'string' ? `'${newValue}'` : newValue;
      return `Property '${parents}${key}' was updated. From ${newOld} to ${newNew}`;
    }
    default:
      return 'Unknown type';
  }
};

const render = (data) => {
  const iter = (obj, depth) => {
    const result = obj.map((element) => {
      const {
        key, children,
      } = element;
      if (children.length === 0) {
        return parse(element, depth);
      }
      return iter(children, `${depth}${key}.`);
    }, []);
    return result.filter((e) => e.trim()).join('\n');
  };
  return iter(data, '');
};

export default render;
