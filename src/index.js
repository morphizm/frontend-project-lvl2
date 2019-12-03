import parse from './parsers';
import diff from './ast';
import getRender from './formatters';


const genDiff = (pathToFile1, pathToFile2, format) => {
  const oldFile = parse(pathToFile1);
  const newFile = parse(pathToFile2);
  const difference = diff(oldFile, newFile);
  const render = getRender(format);
  const result = render(difference);
  return result;
};

export default genDiff;
