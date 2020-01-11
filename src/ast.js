import _ from 'lodash';

const makeDiff = (oldContent, newContent) => {
  const oldKeys = Object.keys(oldContent);
  const newKeys = Object.keys(newContent);
  const keys = _.union(newKeys, oldKeys);

  const tree = keys.map((key) => {
    const hasOldKey = _.has(oldContent, key);
    const hasNewKey = _.has(newContent, key);
    const oldValue = oldContent[key];
    const newValue = newContent[key];

    if (!hasOldKey && hasNewKey) {
      const node = {
        key,
        nodeType: 'removed',
        value: newValue,
      };
      return node;
    }

    if (hasOldKey && !hasNewKey) {
      const node = {
        key,
        nodeType: 'added',
        value: oldValue,
      };
      return node;
    }

    const oldValueTypeIsObject = _.isObject(oldValue);
    const newValueTypeIsObject = _.isObject(newValue);

    if (oldValueTypeIsObject && newValueTypeIsObject) {
      return {
        key, nodeType: 'nested', children: makeDiff(oldValue, newValue),
      };
    }

    if (oldValue === newValue) {
      return {
        key, nodeType: 'identical', value: oldValue,
      };
    }

    return {
      key, nodeType: 'changed', oldValue, newValue,
    };
  }, []);

  return tree;
};

export default makeDiff;
