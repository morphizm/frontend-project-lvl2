import _ from 'lodash';

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

const diff = (oldFile, newFile) => {
  const oldKeys = Object.keys(oldFile);
  const newKeys = Object.keys(newFile);
  const keys = _.uniq([...newKeys, ...oldKeys]);

  const dividedKeys = keys.reduce((acc, key) => {
    const [deleted, added, updated] = acc;
    if (!oldKeys.includes(key) && newKeys.includes(key)) {
      const newDeleted = [...deleted, key];
      return [newDeleted, added, updated];
    }
    if (oldKeys.includes(key) && !newKeys.includes(key)) {
      const newAdded = [...added, key];
      return [deleted, newAdded, updated];
    }
    const newUpdated = [...updated, key];
    return [deleted, added, newUpdated];
  }, [[], [], []]);

  const [deleted, added, updated] = dividedKeys;

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

export default diff;
