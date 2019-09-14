import _ from 'lodash';
import parse from './parsers';

const genDiff = (pathToFile1, pathToFile2) => {
  const oldFile = parse(pathToFile1);
  const newFile = parse(pathToFile2);
  const oldKeys = Object.keys(oldFile);
  const newKeys = Object.keys(newFile);

  const interResult = oldKeys.reduce((acc, key) => {
    if (_.has(newFile, key)) {
      if (oldFile[key] === newFile[key]) {
        return [`  ${key}: ${oldFile[key]}`, ...acc];
      }
      const str = `+ ${key}: ${oldFile[key]}\n- ${key}: ${newFile[key]}`;
      const newAcc = [...acc, str];
      return newAcc;
    }
    const str = `+ ${key}: ${oldFile[key]}`;
    return [...acc, str];
  }, []);

  const uniqNewKeys = newKeys
    .filter((key) => !_.has(oldFile, key))
    .reduce((acc, key) => {
      const str = `- ${key}: ${newFile[key]}`;
      return [...acc, str];
    }, []);
  const result = interResult.concat(uniqNewKeys);

  return `{\n${result.join('\n')}\n}`;
};

export default genDiff;
