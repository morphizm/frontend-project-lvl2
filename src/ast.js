const parse = (func, obj, key) => {
  if (obj[key] instanceof Object) {
    return {
      value: undefined,
      children: func(obj[key], obj[key]),
    };
  }
  return {
    value: obj[key],
    children: [],
  };
};

export const diff = (oldFile, newFile) => {
  const oldKeys = Object.keys(oldFile);
  const newKeys = Object.keys(newFile);
  const deleted = newKeys.filter((key) => !oldKeys.includes(key));
  const added = oldKeys.filter((key) => !newKeys.includes(key));
  const updated = newKeys.filter((key) => oldKeys.includes(key));

  const deL = deleted.reduce((acc, key) => {
    const ast = {
      key,
      action: 'removed',
      ...parse(diff, newFile, key),
    };
    return [...acc, ast];
  }, []);

  const neW = added.reduce((acc, key) => {
    const ast = {
      key,
      action: 'added',
      ...parse(diff, oldFile, key),
    };
    return [...acc, ast];
  }, []);

  const uP = updated.reduce((acc, key) => {
    const old = oldFile[key];
    const $new = newFile[key];

    if (old instanceof Object && $new instanceof Object) {
      const ast = {
        key, value: {}, action: 'updated', children: diff(old, $new),
      };
      return [...acc, ast];
    }

    if (old instanceof Object && !($new instanceof Object)) {
      const ast = {
        key, value: { $new }, action: 'updated', children: diff(old, old),
      };
      return [...acc, ast];
    }

    if (!(old instanceof Object) && $new instanceof Object) {
      const ast = {
        key, value: { old }, action: 'updated', children: diff($new, $new),
      };
      return [...acc, ast];
    }

    if (old === $new) {
      const ast = {
        key, value: { old, $new }, action: 'updated', children: [],
      };
      return [...acc, ast];
    }
    const ast = {
      key, value: { old, $new }, action: 'updated', children: [],
    };
    return [...acc, ast];
  }, []);

  return [...uP, ...neW, ...deL];
};

export const repeat = (level) => ' '.repeat(level);

const spaces = {
  added: (e) => `${repeat(e)}+ `,
  removed: (e) => `${repeat(e)}- `,
  updated: (e) => `${repeat(e + 2)}`,
};

const forUp = (elem, level) => {
  const { value, key } = elem;
  if (value instanceof Object) {
    const { old, $new } = value;
    if (old === $new) {
      const space = repeat(level + 2);
      const str = `${space}${key}: ${old}`;
      return str;
    }
    const space = repeat(level);
    const str = `${space}+ ${key}: ${value.old}\n${space}- ${key}: ${value.$new}`;
    return str;
  }
  const space = repeat(level + 2);
  const str = `${space}${key}: ${value.old}`;
  return str;
};

const forChild = (func, elem, level) => {
  const space = repeat(level);
  const { key, value, children } = elem;
  const { old, $new } = value;
  if (old && $new) {
    if (old === $new) {
      const str = `${space} ${key}: ${old}`;
      return str;
    }
    const str = `${space}+ ${key}: ${old}\n${space}- ${key}: ${$new}`;
    return str;
  }
  if (old && !$new) {
    const str = `${space}+ ${key}: ${old}\n${space}- ${key}: {\n${func(children, level + 4)}\n${repeat(level + 2)}}`;
    return str;
  }
  if (!old && $new) {
    const str = `${space}- ${key}: ${$new}\n${space}+ ${key}: {\n${func(children, level + 4)}\n${repeat(level + 2)}}`;
    return str;
  }
  const str = `${space}  ${key}: {\n${func(children, level + 4)}\n${repeat(level + 2)}}`;
  return str;
};

export const render = (data) => {
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
