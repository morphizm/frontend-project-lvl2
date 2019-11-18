const parse = (element, parents) => {
  const complexValue = '[complex value]';
  const {
    key, value, action, children,
  } = element;
  if (action === 'added') {
    const str = `Property '${parents}${key}' was removed`;
    return str;
  }
  if (action === 'removed') {
    const complex = children.length > 0 ? complexValue : value;
    if (typeof value === 'string') {
      const str = `Property '${parents}${key}' was added with value: '${complex}'`;
      return str;
    }
    const str = `Property '${parents}${key}' was added with value: ${complex}`;
    return str;
  }
  const { old, $new } = value;
  if ((old && old === $new) || (!old && !$new)) {
    return '';
  }
  const newOld = typeof old === 'string' ? `'${old}'` : old;
  const newNew = typeof $new === 'string' ? `'${$new}'` : $new;
  const oldComplex = newOld || complexValue;
  const newComplex = newNew || complexValue;
  const str = `Property '${parents}${key}' was updated. From ${oldComplex} to ${newComplex}`;
  return str;
};

const render = (data) => {
  const iter = (obj, depth) => {
    const result = obj.reduce((acc, element) => {
      if (element.children.length === 0) {
        const newAcc = parse(element, depth);
        return [...acc, newAcc];
      }
      if (element.action === 'added') {
        const newAcc = parse(element, depth);
        return [...acc, newAcc];
      }
      if (element.action === 'removed') {
        const newAcc = parse(element, depth);
        return [...acc, newAcc];
      }
      const newAcc = iter(element.children, `${depth}${element.key}.`);
      return [...acc, newAcc];
    }, []);
    return result.filter((e) => e.trim()).join('\n');
  };

  return iter(data, '');
};

export default render;
