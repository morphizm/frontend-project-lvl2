const repeat = (level) => ' '.repeat(level);

const spaces = {
  added: (e) => `${repeat(e)}+ `,
  removed: (e) => `${repeat(e)}- `,
  updated: (e) => `${repeat(e + 2)}`,
};

const stringify = (object, spaceForBracket, spaceForKey) => {
  const entries = Object.entries(object);
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
  const spaceForBracket = repeat(level + 2);
  const spaceForKey = repeat(level + 6);
  const newValueStr = newValue instanceof Object
    ? stringify(newValue, spaceForBracket, spaceForKey) : newValue;
  const oldValueStr = oldValue instanceof Object
    ? stringify(oldValue, spaceForBracket, spaceForKey) : oldValue;
  const str = `${space}+ ${key}: ${oldValueStr}\n${space}- ${key}: ${newValueStr}`;
  return str;
};


const render = (data) => {
  const iter = (obj, level = 2) => {
    const result = obj.map((element) => {
      const {
        value, key, action, children,
      } = element;

      if (action !== 'updated') {
        const space = spaces[action](level);
        if (value instanceof Object) {
          const str = `${space}${key}: ${stringify(value, repeat(level + 2), repeat(level + 6))}`;
          return str;
        }
        const str = `${space}${key}: ${value}`;
        return str;
      }

      if (children.length === 0) {
        const str = forUpdatedAction(element, level);
        return str;
      }

      const space = spaces[action](level);
      const str = `${space}${key}: {\n${iter(children, level + 4)}\n${repeat(level + 2)}}`;
      return str;
    }, []);

    return result.join('\n');
  };
  return `{\n${iter(data)}\n}`;
};

export default render;
