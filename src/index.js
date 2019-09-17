// import _ from 'lodash';
import parse from './parsers';
import { diff, render } from './ast';

const genDiff = (pathToFile1, pathToFile2) => {
  const oldFile = parse(pathToFile1);
  const newFile = parse(pathToFile2);
  const result = render(diff(oldFile, newFile));
  return result;
};

export default genDiff;
