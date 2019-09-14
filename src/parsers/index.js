import yaml from 'js-yaml';
import path from 'path';
import fs from 'fs';
import ini from 'ini';

const formatToArray = {
  '.yml': (e) => yaml.safeLoad(e),
  '.json': (e) => JSON.parse(e),
  '.ini': (e) => ini.parse(e),
};

const parse = (filePath) => {
  const extname = path.extname(filePath);
  const readFile = fs.readFileSync(filePath, 'utf-8');
  return formatToArray[extname](readFile);
};

export default parse;
