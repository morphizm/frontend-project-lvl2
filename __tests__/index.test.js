import genDiff from '../src';

const afterJson = `${__dirname}/__fixtures__/after.json`;
const beforeJson = `${__dirname}/__fixtures__/before.json`;
const afterYaml = `${__dirname}/__fixtures__/after.yml`;
const beforeYaml = `${__dirname}/__fixtures__/before.yml`;
const afterIni = `${__dirname}/__fixtures__/after.ini`;
const beforeIni = `${__dirname}/__fixtures__/before.ini`;

const diffBtoA = [
  '{',
  '  host: hexlet.io',
  '+ timeout: 20',
  '- timeout: 50',
  '+ verbose: true',
  '- proxy: 123.234.53.22',
  '- follow: false',
  '}',
].join('\n');
const diffAtoB = [
  '{',
  '  host: hexlet.io',
  '+ timeout: 50',
  '- timeout: 20',
  '+ proxy: 123.234.53.22',
  '+ follow: false',
  '- verbose: true',
  '}',
].join('\n');

test('json', () => {
  expect(genDiff(afterJson, beforeJson)).toEqual(diffBtoA);
  expect(genDiff(beforeJson, afterJson)).toEqual(diffAtoB);
});
test('yaml', () => {
  expect(genDiff(afterYaml, beforeYaml)).toEqual(diffBtoA);
  expect(genDiff(beforeYaml, afterYaml)).toEqual(diffAtoB);
});
test('ini', () => {
  expect(genDiff(afterIni, beforeIni)).toEqual(diffBtoA);
  expect(genDiff(beforeIni, afterIni)).toEqual(diffAtoB);
});

test.each([[afterJson, beforeJson, diffBtoA],
  [afterIni, beforeIni, diffBtoA],
  [afterYaml, beforeYaml, diffBtoA]])(
  'J I Y',
  (a, b, exp) => {
    expect(genDiff(a, b)).toEqual(exp);
  },
);
