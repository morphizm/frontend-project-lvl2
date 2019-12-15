import fs from 'fs';
import parse from './parsers';
import makeDiff from './ast';
import getRender from './formatters';


const genDiff = (pathToFile1, pathToFile2, format) => {
  const oldData = fs.readFileSync(pathToFile1, 'utf-8');
  const oldContent = parse(oldData, pathToFile1);

  const newData = fs.readFileSync(pathToFile2, 'utf-8');
  const newContent = parse(newData, pathToFile2);

  const difference = makeDiff(oldContent, newContent);
  const render = getRender(format);
  const result = render(difference);
  return result;
};

export default genDiff;
