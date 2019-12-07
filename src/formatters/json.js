const parseWithKey = (elem) => {
  const { key, value, children } = elem;
  if (children.length === 0) {
    const res = value.oldValue ? value.oldValue : value;
    return { [key]: res };
  }
  return children.map((e) => parseWithKey(e));
};

const parse = (elem) => {
  const { value, children } = elem;
  if (children.length === 0) {
    const res = value.oldValue ? value.oldValue : value;
    return res;
  }
  return children.reduce((acc, e) => ({ ...acc, ...parseWithKey(e) }), {});
};

const updatedParse = (elem, func) => {
  const { value, children } = elem;
  if (children.length === 0) {
    return [value.oldValue, value.newValue];
  }
  return [func(children)];
};

const render = (data) => {
  const iter = (obj) => obj.reduce((acc, elem) => {
    if (elem.action === 'removed') {
      const newAcc = [elem.action, parse(elem)];
      return { ...acc, [elem.key]: newAcc };
    }
    if (elem.action === 'added') {
      const newAcc = [elem.action, parse(elem)];
      return { ...acc, [elem.key]: newAcc };
    }
    const newAcc = [elem.action, ...updatedParse(elem, render)];
    return { ...acc, [elem.key]: newAcc };
  }, {});

  return iter(data);
};

export default render;
