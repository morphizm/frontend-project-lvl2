import fs from 'fs';
import parse from './parsers';
import diff from './ast';
import getRender from './formatters';


const genDiff = (pathToFile1, pathToFile2, format) => {
  const readOldFile = fs.readFileSync(pathToFile1, 'utf-8');
  const oldFile = parse(readOldFile, pathToFile1);

  const readNewFile = fs.readFileSync(pathToFile2, 'utf-8');
  const newFile = parse(readNewFile, pathToFile2);

  const difference = diff(oldFile, newFile);
  const render = getRender(format);
  const result = render(difference);
  return result;
};

export default genDiff;
