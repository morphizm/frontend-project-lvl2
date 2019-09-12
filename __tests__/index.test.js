import genDiff from '../src';

const after = `${__dirname}/__fixtures__/after.json`;
const before = `${__dirname}/__fixtures__/before.json`;
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

test('gendiff', () => {
  expect(genDiff(after, before)).toEqual(diffBtoA);
  expect(genDiff(before, after)).toEqual(diffAtoB);
});
