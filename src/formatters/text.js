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

const forUpdatedAction = (elem, level) => {
  const { value, key } = elem;
  const { newValue, oldValue } = value;
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
      const {
        value, key, action, children,
      } = element;
      const space = spaces[action](level);
      switch (action) {
        case 'added':
          return `${space}${key}: ${stringify(value, level)}`;
        case 'removed':
          return `${space}${key}: ${stringify(value, level)}`;
        case 'updated':
          if (children.length === 0) {
            const str = forUpdatedAction(element, level);
            return str;
          }
          return `${space}${key}: {\n${iter(children, level + 4)}\n${space}}`;
        default:
          throw new Error('Unknown type');
      }
    }, []);

    return result.join('\n');
  };
  return `{\n${iter(data)}\n}`;
};

export default render;
