/**
 * level + 2 - два отступа для нижних скобок
 * level + 4 - На четыре отступа увеличивается свободное пространство
 * при рекурсивном переходе на уровень ниже
 * level + 8 - На 8 отступов надо увеличивать пространство для ключей в объекте,
 * у которого нет детей
 */

const repeat = (level) => ' '.repeat(level);

const stringify = (data, level) => {
  if (!(data instanceof Object)) {
    return data;
  }

  const spaceForBracket = repeat(level + 4);
  const spaceForKey = repeat(level + 8);
  const entries = Object.entries(data);
  const result = entries.map(([key, value]) => `${spaceForKey}${key}: ${value}`);
  const str = `{\n${result.join('\n')}\n${spaceForBracket}}`;
  return str;
};

const stringifyUpdated = (elem, level, func) => {
  const {
    key, children,
  } = elem;
  const space = repeat(level + 4);
  return `${space}${key}: {\n${func(children, level + 4)}\n${space}}`;
};

const stringifyNested = (elem, level) => {
  const { key, oldValue, newValue } = elem;
  const space = repeat(level + 2);
  return `${space}+ ${key}: ${stringify(oldValue, level)}\n${space}- ${key}: ${stringify(newValue, level)}`;
};

const render = (data) => {
  const iter = (obj, level = 0) => {
    const result = obj.map((element) => {
      const { value, key, nodeType } = element;
      const space = repeat(level);
      switch (nodeType) {
        case 'added':
          return `  ${space}+ ${key}: ${stringify(value, level)}`;
        case 'removed':
          return `  ${space}- ${key}: ${stringify(value, level)}`;
        case 'updated':
          return stringifyUpdated(element, level, iter);
        case 'identical':
          return `  ${space}  ${key}: ${stringify(value, level)}`;
        case 'nested':
          return stringifyNested(element, level);
        default:
          throw new Error(`Unknown node type: ${nodeType}`);
      }
    }, []);

    return result.join('\n');
  };
  return `{\n${iter(data)}\n}`;
};

export default render;
