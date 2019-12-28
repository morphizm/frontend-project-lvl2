/**
 * level + 2 - два отступа для нижних скобок
 * level + 4 - На четыре отступа увеличивается свободное пространство
 * при рекурсивном переходе на уровень ниже
 * level + 6 - На 6 отступов надо увеличивать пространство для ключей в объекте,
 * у которого нет детей
 */

const repeat = (level) => ' '.repeat(level);

const spaces = {
  added: (e) => `${repeat(e)}+ `,
  removed: (e) => `${repeat(e)}- `,
  updated: (e) => `${repeat(e + 2)}`,
};

const stringify = (data, level) => {
  if (!(data instanceof Object)) {
    return data;
  }

  const spaceForBracket = repeat(level + 2);
  const spaceForKey = repeat(level + 6);
  const entries = Object.entries(data);
  const result = entries.map(([key, value]) => `${spaceForKey}${key}: ${value}`);
  const str = `{\n${result.join('\n')}\n${spaceForBracket}}`;
  return str;
};

const stringifyUpdated = (elem, level, func) => {
  const {
    key, newValue, oldValue, children,
  } = elem;
  if (children) {
    const space = repeat(level + 2);
    return `${space}${key}: {\n${func(children, level + 4)}\n${space}}`;
  }
  if (oldValue === newValue) {
    const space = repeat(level + 2);
    const str = `${space}${key}: ${oldValue}`;
    return str;
  }
  const space = repeat(level);

  const newValueStr = stringify(newValue, level);
  const oldValueStr = stringify(oldValue, level);

  const str = `${space}+ ${key}: ${oldValueStr}\n${space}- ${key}: ${newValueStr}`;
  return str;
};


const render = (data) => {
  const iter = (obj, level = 2) => {
    const result = obj.map((element) => {
      const { value, key, nodeType } = element;
      const space = spaces[nodeType](level);
      switch (nodeType) {
        case 'added':
          return `${space}${key}: ${stringify(value, level)}`;
        case 'removed':
          return `${space}${key}: ${stringify(value, level)}`;
        case 'updated':
          return stringifyUpdated(element, level, iter);
        default:
          throw new Error(`Unknown node type: ${nodeType}`);
      }
    }, []);

    return result.join('\n');
  };
  return `{\n${iter(data)}\n}`;
};

export default render;
