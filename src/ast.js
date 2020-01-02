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
      const node = {
        key, nodeType: 'updated', children: makeDiff(oldValue, newValue),
      };
      return node;
    }

    if (oldValue === newValue) {
      const node = {
        key, nodeType: 'identical', value: oldValue,
      };
      return node;
    }

    const node = {
      key, nodeType: 'changed', oldValue, newValue,
    };
    return node;
  }, []);

  return tree;
};

export default makeDiff;
