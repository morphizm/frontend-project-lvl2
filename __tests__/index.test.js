import genDiff from '../src';

const after = '/home/ivan/after.json';
const before = '/home/ivan/before.json';
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

// eslint-disable-next-line no-undef
test('gendiff', () => {
  // eslint-disable-next-line no-undef
  expect(genDiff(after, before)).toEqual(diffBtoA);
  // eslint-disable-next-line no-undef
  expect(genDiff(before, after)).toEqual(diffAtoB);
});
