import parse from './parsers';
import diff from './ast';
import renderPlain from './formatters/plain';
import renderJson from './formatters/json';
import renderText from './formatters/text';


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
  const result = renderText(difference);
  return result;
};

export default genDiff;
