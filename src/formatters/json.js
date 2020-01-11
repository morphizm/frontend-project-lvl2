import _ from 'lodash';

const correctNodeTypes = ['changed', 'nested', 'removed', 'added', 'identical'];

const render = (data) => {
  const iter = (items) => {
    const result = items.reduce((acc, item) => {
      const { nodeType, children } = item;
      if (!_.includes(correctNodeTypes, nodeType)) {
        throw new Error(`Unknown node type: ${nodeType}`);
      }
      if (nodeType === 'nested') {
        const nodes = _.get(acc, nodeType, []);
        const newItem = iter(children);
        return { ...acc, [nodeType]: [...nodes, newItem] };
      }
      const nodes = _.get(acc, nodeType, []);
      const newItem = _.omit(item, 'nodeType');
      return { ...acc, [nodeType]: [...nodes, newItem] };
    }, {});
    return result;
  };
  return iter(data);
};

export default render;
