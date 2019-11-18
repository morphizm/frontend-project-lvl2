import parse from './parsers';
import { diff, render } from './ast';
import { render as renderPlain } from './formatters/plain';
import { render as renderJson } from './formatters/json';

const genDiff = (pathToFile1, pathToFile2, format) => {
  const oldFile = parse(pathToFile1);
  const newFile = parse(pathToFile2);
  const difference = diff(oldFile, newFile);
  if (format === 'plain') {
    const result = renderPlain(difference);
    return result;
  }
  if (format === 'json') {
    const result = renderJson(difference);
    return JSON.stringify(result);
  }
  const result = render(difference);
  return result;
};

export default genDiff;
