import yaml from 'js-yaml';
import ini from 'ini';

const formatToArray = {
  '.yml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};

const parse = (content, extname) => formatToArray[extname](content);

export default parse;
