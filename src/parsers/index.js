import yaml from 'js-yaml';
import ini from 'ini';

const formatToArray = {
  yml: yaml.safeLoad,
  json: JSON.parse,
  ini: ini.parse,
};

const parse = (content, type) => formatToArray[type](content);

export default parse;
