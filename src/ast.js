import _ from 'lodash';

const getOperationName = (key, oldContent, newContent) => {
  const hasOldKey = _.has(oldContent, key);
  const hasNewKey = _.has(newContent, key);
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

  const tree = keys.map((key) => {
    const action = getOperationName(key, oldContent, newContent);
    const templateNode = {
      key, action,
    };
    const oldValue = oldContent[key];
    const newValue = newContent[key];

    if (action === 'removed') {
      const node = {
        ...templateNode,
        value: newValue,
        children: [],
      };
      return node;
    }

    if (action === 'added') {
      const node = {
        ...templateNode,
        value: oldValue,
        children: [],
      };
      return node;
    }

    const oldValueTypeIsObject = _.isObject(oldValue);
    const newValueTypeIsObject = _.isObject(newValue);

    if (oldValueTypeIsObject && newValueTypeIsObject) {
      const node = {
        ...templateNode, value: {}, children: makeDiff(oldValue, newValue),
      };
      return node;
    }

    const node = {
      ...templateNode, value: { oldValue, newValue }, children: [],
    };
    return node;
  }, []);

  return tree;
};

export default makeDiff;
