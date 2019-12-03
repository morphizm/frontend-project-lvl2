import fs from 'fs';
import genDiff from '../src';

const path = `${__dirname}/__fixtures__`;

const afterJson = `${path}/after.json`;
const beforeJson = `${path}/before.json`;
const afterYaml = `${path}/after.yml`;
const beforeYaml = `${path}/before.yml`;
const afterIni = `${path}/after.ini`;
const beforeIni = `${path}/before.ini`;

const plainBefore = `${path}/beforePlain.json`;
const plainAfter = `${path}/afterPlain.json`;

describe('FORMATS', () => {
  const diffAtoB = fs.readFileSync(`${path}/resultAB.txt`, 'utf-8');
  const diffBtoA = fs.readFileSync(`${path}/resultBA.txt`, 'utf-8');
  const diffBigBtoA = fs.readFileSync(`${path}/resultNested.txt`, 'utf-8');

  test.each([[afterJson, beforeJson],
    [afterIni, beforeIni],
    [afterYaml, beforeYaml]])(
    'JSON 0, INI 1, YAML 2 current %#',
    (a, b) => {
      expect(genDiff(a, b)).toEqual(diffBtoA);
      expect(genDiff(b, a)).toEqual(diffAtoB);
    },
  );

  test('nested json', () => {
    const nestedAfterJson = `${path}/nestedAfter.json`;
    const nestedBeforeJson = `${path}/nestedBefore.json`;
    expect(genDiff(nestedAfterJson, nestedBeforeJson)).toEqual(diffBigBtoA);
  });

  test('nested yaml', () => {
    const nestedAfterYAML = `${path}/nestedAfter.yml`;
    const nestedBeforeYAML = `${path}/nestedBefore.yml`;
    expect(genDiff(nestedAfterYAML, nestedBeforeYAML)).toEqual(diffBigBtoA);
  });

  test('nested ini', () => {
    const nestedBeforeINI = `${path}/nestedBefore.ini`;
    const nestedAfterINI = `${path}/nestedAfter.ini`;
    expect(genDiff(nestedAfterINI, nestedBeforeINI)).toEqual(diffBigBtoA);
  });

  test('plain', () => {
    const plainFormat = fs.readFileSync(`${path}/resultPlain.txt`, 'utf-8');
    expect(genDiff(plainBefore, plainAfter, 'plain')).toEqual(plainFormat);
  });

  test('json', () => {
    const json = fs.readFileSync(`${path}/resultJson.txt`, 'utf-8');
    expect(genDiff(plainAfter, plainBefore, 'json')).toEqual(json);
  });
});
