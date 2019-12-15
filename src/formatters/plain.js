const parse = (element, parents) => {
  const complexValue = '[complex value]';
  const {
    key, value, action,
  } = element;
  if (action === 'added') {
    const str = `Property '${parents}${key}' was removed`;
    return str;
  }
  if (action === 'removed') {
    const stringValue = typeof value === 'string' ? `'${value}'` : value;
    const complex = stringValue instanceof Object ? complexValue : stringValue;
    const str = `Property '${parents}${key}' was added with value: ${complex}`;
    return str;
  }
  const { oldValue, newValue } = value;
  const newOld = typeof oldValue === 'string' ? `'${oldValue}'` : oldValue;
  const newNew = typeof newValue === 'string' ? `'${newValue}'` : newValue;
  const str = `Property '${parents}${key}' was updated. From ${newOld} to ${newNew}`;
  return str;
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
