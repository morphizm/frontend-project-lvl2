import yaml from 'js-yaml';
import ini from 'ini';

const mapping = {
  yml: yaml.safeLoad,
  json: JSON.parse,
  ini: ini.parse,
};

const parse = (content, type) => mapping[type](content);

export default parse;
