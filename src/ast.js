// import _ from 'lodash';

export const repeat = (level) => ' '.repeat(level);

const elemsChild = (obj) => {
  const keys = Object.keys(obj);
  const result = keys.reduce((acc, elem) => {
    if (obj[elem] instanceof Object) {
      const newAcc = {
        key: elem,
        value: '',
        action: 'updated',
        children: elemsChild(obj[elem]),
      };
      return [...acc, newAcc];
    }
    const newAcc = {
      key: elem,
      value: obj[elem],
      action: 'updated',
      children: [],
    };
    return [...acc, newAcc];
  }, []);
  return result;
};

export const diff = (data1, data2) => {
  const k1 = Object.keys(data1);
  const k2 = Object.keys(data2);
  const deletedKeys = k2.filter((key) => !k1.includes(key));
  const addedKeys = k1.filter((key) => !k2.includes(key));
  const updatedKeys = k1.filter((key) => k2.includes(key));

  const astDel = deletedKeys.reduce((acc, elem) => {
    if (data2[elem] instanceof Object) {
      const newAcc = {
        key: elem,
        value: '',
        action: 'deleted',
        children: elemsChild(data2[elem]),
      };
      return [...acc, newAcc];
    }
    const newAcc = {
      key: elem,
      value: data2[elem],
      action: 'deleted',
      children: [],
    };
    return [...acc, newAcc];
  }, []);

  const astAdd = addedKeys.reduce((acc, elem) => {
    if (data1[elem] instanceof Object) {
      const newAcc = {
        key: elem,
        value: '',
        action: 'added',
        children: elemsChild(data1[elem]),
      };
      return [...acc, newAcc];
    }
    const newAcc = {
      key: elem,
      value: data1[elem],
      action: 'added',
      children: [],
    };
    return [...acc, newAcc];
  }, []);

  const astUpd = updatedKeys.reduce((acc, elem) => {
    if (data1[elem] === data2[elem]) {
      const newAcc = {
        key: elem,
        value: data1[elem],
        action: 'updated',
        children: [],
      };
      return [...acc, newAcc];
    }
    if (data1[elem] instanceof Object && data2[elem] instanceof Object) {
      const newAcc = {
        key: elem,
        value: '',
        action: 'updated',
        children: diff(data1[elem], data2[elem]),
      };
      return [...acc, newAcc];
    }
    const newAdd = {
      key: elem,
      value: data1[elem] instanceof Object ? '' : data1[elem],
      action: 'added',
      children: data1[elem] instanceof Object ? elemsChild(data1[elem]) : [],
    };
    const newDel = {
      key: elem,
      value: data2[elem] instanceof Object ? '' : data2[elem],
      action: 'deleted',
      children: data2[elem] instanceof Object ? elemsChild(data2[elem]) : [],
    };
    return [...acc, newAdd, newDel];
  }, []);
  return [...astUpd, ...astAdd, ...astDel];
};

const spacecOfAction = {
  added: (e) => `${repeat(e)}+ `,
  deleted: (e) => `${repeat(e)}- `,
  updated: (e) => `${repeat(e + 2)}`,
};

/*
const stringify = (value, level) => {
  if (value instanceof Object) {
    //
  }
  const str = ` ${value}`;
  return str;
};
// */
export const render = (dif) => {
  const iter = (obj, level = 2) => {
    const result = obj.reduce((acc, elem) => {
      if (elem.children.length === 0) {
        const str = `${spacecOfAction[elem.action](level)}${elem.key}: ${elem.value}`;
        return [...acc, str];
      }
      const str = `${spacecOfAction[elem.action](level)}${elem.key}: {\n${iter(elem.children, level + 4)}\n${repeat(level + 2)}}`;
      return [...acc, str];
    }, []);
    return result.join('\n');
  };
  return `{\n${iter(dif)}\n}`;
};
