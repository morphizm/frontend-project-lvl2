import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixuturePath = (name) => path.join(__dirname, '__fixtures__', name);

const afterJson = getFixuturePath('after.json');
const beforeJson = getFixuturePath('before.json');
const afterYaml = getFixuturePath('after.yml');
const beforeYaml = getFixuturePath('before.yml');
const afterIni = getFixuturePath('after.ini');
const beforeIni = getFixuturePath('before.ini');

const plainBefore = getFixuturePath('beforePlain.json');
const plainAfter = getFixuturePath('afterPlain.json');

describe('FORMATS', () => {
  const diffAtoB = fs.readFileSync(getFixuturePath('resultAB.txt'), 'utf-8');
  const diffBtoA = fs.readFileSync(getFixuturePath('resultBA.txt'), 'utf-8');
  const diffBigBtoA = fs.readFileSync(getFixuturePath('resultNested.txt'), 'utf-8');

  test.each([[afterJson, beforeJson],
    [afterIni, beforeIni],
    [afterYaml, beforeYaml]])(
    'JSON 0, INI 1, YAML 2 current %#',
    (a, b) => {
      expect(genDiff(a, b)).toEqual(diffBtoA);
      expect(genDiff(b, a)).toEqual(diffAtoB);
    },
  );

  test.each([['json'], ['yml'], ['ini']])(
    'nested %s',
    (type) => {
      const after = getFixuturePath(`nestedAfter.${type}`);
      const before = getFixuturePath(`nestedBefore.${type}`);
      expect(genDiff(after, before)).toEqual(diffBigBtoA);
    },
  );

  test('plain', () => {
    const plainFormat = fs.readFileSync(getFixuturePath('resultPlain.txt'), 'utf-8');
    expect(genDiff(plainAfter, plainBefore, 'plain')).toEqual(plainFormat);
  });

  test('json', () => {
    const json = fs.readFileSync(getFixuturePath('resultJson.txt'), 'utf-8');
    expect(genDiff(plainAfter, plainBefore, 'json')).toEqual(JSON.parse(json));
  });
});
