import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const formatToArray = {
  '.yml': (e) => yaml.safeLoad(e),
  '.json': (e) => JSON.parse(e),
  '.ini': (e) => ini.parse(e),
};

const parse = (readyFile, pathname) => {
  const extname = path.extname(pathname);
  return formatToArray[extname](readyFile);
};

export default parse;
