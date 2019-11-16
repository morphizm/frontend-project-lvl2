// import _ from 'lodash';
import parse from './parsers';
import { diff, render } from './ast';
import { render as renderPlain } from './formatters/plain';

const genDiff = (pathToFile1, pathToFile2, format) => {
  const oldFile = parse(pathToFile1);
  const newFile = parse(pathToFile2);
  const difference = diff(oldFile, newFile);
  if (format === 'plain') {
    const result = renderPlain(difference);
    return result;
  }
  const result = render(difference);
  return result;
};

export default genDiff;
