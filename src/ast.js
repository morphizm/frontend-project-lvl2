import _ from 'lodash';

const parse = (func, content) => {
  if (_.isObject(content)) {
    return {
      value: undefined,
      children: func(content, content),
    };
  }
  return {
    value: content,
    children: [],
  };
};

const whatHappensWithKey = (key, oldKeys, newKeys) => {
  const hasOldKey = oldKeys.includes(key);
  const hasNewKey = newKeys.includes(key);
  if (!hasOldKey && hasNewKey) {
    return 'removed';
  }
  if (hasOldKey && !hasNewKey) {
    return 'added';
  }
  return 'updated';
};

const makeDiff = (oldContent, newContent) => {
  const oldKeys = Object.keys(oldContent);
  const newKeys = Object.keys(newContent);
  const keys = _.union(newKeys, oldKeys);

  const tree = keys.reduce((acc, key) => {
    const action = whatHappensWithKey(key, oldKeys, newKeys);
    const templateNode = {
      key, action,
    };
    const oldValue = oldContent[key];
    const newValue = newContent[key];

    if (action === 'removed') {
      const node = {
        ...templateNode,
        ...parse(makeDiff, newValue),
      };
      return [...acc, node];
    }

    if (action === 'added') {
      const node = {
        ...templateNode,
        ...parse(makeDiff, oldValue),
      };
      return [...acc, node];
    }

    const oldValueTypeIsObject = _.isObject(oldValue);
    const newValueTypeIsObject = _.isObject(newValue);

    if (oldValueTypeIsObject && newValueTypeIsObject) {
      const node = {
        ...templateNode, value: {}, children: makeDiff(oldValue, newValue),
      };
      return [...acc, node];
    }

    if (oldValueTypeIsObject && !newValueTypeIsObject) {
      const node = {
        ...templateNode, value: { newValue }, children: makeDiff(oldValue, oldValue),
      };
      return [...acc, node];
    }

    if (!oldValueTypeIsObject && newValueTypeIsObject) {
      const node = {
        ...templateNode, value: { oldValue }, children: makeDiff(newValue, newValue),
      };
      return [...acc, node];
    }

    const node = {
      ...templateNode, value: { oldValue, newValue }, children: [],
    };
    return [...acc, node];
  }, []);

  return tree;
};

export default makeDiff;
