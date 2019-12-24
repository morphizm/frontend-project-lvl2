import fs from 'fs';
import path from 'path';
import parse from './parsers';
import makeDiff from './ast';
import getRender from './formatters';


const genDiff = (pathToFile1, pathToFile2, format) => {
  const oldData = fs.readFileSync(pathToFile1, 'utf-8');
  const oldType = path.extname(pathToFile1).slice(1);
  const oldContent = parse(oldData, oldType);

  const newData = fs.readFileSync(pathToFile2, 'utf-8');
  const newType = path.extname(pathToFile2).slice(1);
  const newContent = parse(newData, newType);

  const difference = makeDiff(oldContent, newContent);
  const render = getRender(format);
  const result = render(difference);
  return result;
};

export default genDiff;
