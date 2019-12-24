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
        action: 'removed',
        value: newValue,
      };
      return node;
    }

    if (hasOldKey && !hasNewKey) {
      const node = {
        key,
        action: 'added',
        value: oldValue,
      };
      return node;
    }

    const oldValueTypeIsObject = _.isObject(oldValue);
    const newValueTypeIsObject = _.isObject(newValue);

    if (oldValueTypeIsObject && newValueTypeIsObject) {
      const node = {
        key, action: 'updated', value: {}, children: makeDiff(oldValue, newValue), childrenType: 'nested',
      };
      return node;
    }

    const node = {
      key, action: 'updated', value: { oldValue, newValue }, children: [], childrenType: 'plain',
    };
    return node;
  }, []);

  return tree;
};

export default makeDiff;
