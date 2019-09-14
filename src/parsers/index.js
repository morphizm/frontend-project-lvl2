import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';

const formatToArray = {
  '.yml': (e) => yaml.safeLoad(e),
  '.json': (e) => JSON.parse(e),
};

const parse = (filePath) => {
  const extname = path.extname(filePath);
  const readFile = fs.readFileSync(filePath, 'utf-8');
  return formatToArray[extname](readFile);
};

export default parse;
