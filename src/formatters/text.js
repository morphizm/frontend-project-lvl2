const repeat = (level) => ' '.repeat(level);

const spaces = {
  added: (e) => `${repeat(e)}+ `,
  removed: (e) => `${repeat(e)}- `,
  updated: (e) => `${repeat(e + 2)}`,
};

const forUp = (elem, level) => {
  const { value, key } = elem;
  if (value instanceof Object) {
    const { oldValue, newValue } = value;
    if (oldValue === newValue) {
      const space = repeat(level + 2);
      const str = `${space}${key}: ${oldValue}`;
      return str;
    }
    const space = repeat(level);
    const str = `${space}+ ${key}: ${value.oldValue}\n${space}- ${key}: ${value.newValue}`;
    return str;
  }
  const space = repeat(level + 2);
  const str = `${space}${key}: ${value.oldValue}`;
  return str;
};

const forChild = (func, elem, level) => {
  const space = repeat(level);
  const { key, value, children } = elem;
  const { oldValue, newValue } = value;
  if (oldValue && newValue) {
    if (oldValue === newValue) {
      const str = `${space} ${key}: ${oldValue}`;
      return str;
    }
    const str = `${space}+ ${key}: ${oldValue}\n${space}- ${key}: ${newValue}`;
    return str;
  }
  if (oldValue && !newValue) {
    const str = `${space}+ ${key}: ${oldValue}\n${space}- ${key}: {\n${func(children, level + 4)}\n${repeat(level + 2)}}`;
    return str;
  }
  if (!oldValue && newValue) {
    const str = `${space}- ${key}: ${newValue}\n${space}+ ${key}: {\n${func(children, level + 4)}\n${repeat(level + 2)}}`;
    return str;
  }
  const str = `${space}  ${key}: {\n${func(children, level + 4)}\n${repeat(level + 2)}}`;
  return str;
};

const render = (data) => {
  const iter = (obj, level = 2) => {
    const result = obj.reduce((acc, elem) => {
      if (elem.children.length === 0) {
        if (elem.action !== 'updated') {
          const space = spaces[elem.action](level);
          const str = `${space}${elem.key}: ${elem.value}`;
          return [...acc, str];
        }
        const str = forUp(elem, level);
        return [...acc, str];
      }
      if (elem.action === 'updated') {
        return [...acc, forChild(iter, elem, level)];
      }

      const space = spaces[elem.action](level);
      const str = `${space}${elem.key}: {\n${iter(elem.children, level + 4)}\n${repeat(level + 2)}}`;
      return [...acc, str];
    }, []);

    return result.join('\n');
  };
  return `{\n${iter(data)}\n}`;
};

export default render;
