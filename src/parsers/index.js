import yaml from 'js-yaml';
import path from 'path';
import ini from 'ini';

const formatToArray = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

const parse = (content, pathname) => {
  const extname = path.extname(pathname);
  return formatToArray[extname](content);
};

export default parse;
