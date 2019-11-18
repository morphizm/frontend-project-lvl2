import genDiff from '../src';

const afterJson = `${__dirname}/__fixtures__/after.json`;
const beforeJson = `${__dirname}/__fixtures__/before.json`;
const afterYaml = `${__dirname}/__fixtures__/after.yml`;
const beforeYaml = `${__dirname}/__fixtures__/before.yml`;
const afterIni = `${__dirname}/__fixtures__/after.ini`;
const beforeIni = `${__dirname}/__fixtures__/before.ini`;

const nestedAfterJson = `${__dirname}/__fixtures__/nestedAfter.json`;
const nestedBeforeJson = `${__dirname}/__fixtures__/nestedBefore.json`;
const nestedAfterYAML = `${__dirname}/__fixtures__/nestedAfter.yml`;
const nestedBeforeYAML = `${__dirname}/__fixtures__/nestedBefore.yml`;
const nestedBeforeINI = `${__dirname}/__fixtures__/nestedBefore.ini`;
const nestedAfterINI = `${__dirname}/__fixtures__/nestedAfter.ini`;

const plainBefore = `${__dirname}/__fixtures__/beforePlain.json`;
const plainAfter = `${__dirname}/__fixtures__/afterPlain.json`;

const plainFormat = [
  "Property 'timeout' was updated. From 50 to 20",
  "Property 'common.setting6.ops' was added with value: 'vops'",
  "Property 'common.setting4' was removed",
  "Property 'common.setting5' was removed",
  "Property 'common.setting2' was added with value: 200",
  "Property 'common.sites' was added with value: 'hexlet.io'",
  "Property 'group1.baz' was updated. From 'bars' to 'bas'",
  "Property 'proxy' was removed",
  "Property 'group3' was removed",
  "Property 'verbose' was added with value: true",
  "Property 'group2' was added with value: [complex value]",
].join('\n');

const json = {
  timeout: ['updated', 20, 50],
  common: ['updated', {
    setting6: ['updated', { ops: ['added', 'vops'] }],
    setting2: ['added', 200],
    sites: ['added', 'hexlet.io'],
    setting4: ['removed', 'text'],
    setting5: ['removed', false],
  }],
  group1: ['updated', {
    baz: ['updated', 'bas', 'bars'],
  }],
  verbose: ['added', true],
  group2: ['added', {
    fee: '100500',
  }],
  proxy: ['removed', '89.0'],
  group3: ['removed', {
    fee: '100500',
  }],
};


const diffBigBtoA = [
  '{',
  '    common: {',
  '        setting1: Value 1',
  '      - setting3: true',
  '      + setting3: {',
  '            key: value',
  '        }',
  '        setting6: {',
  '            key: value',
  '          + ops: vops',
  '        }',
  '      + follow: false',
  '      + setting4: blah blah',
  '      + setting5: {',
  '            key5: value5',
  '        }',
  '      - setting2: 200',
  '    }',
  '    group1: {',
  '      + baz: bars',
  '      - baz: bas',
  '        foo: bar',
  '      + nest: str',
  '      - nest: {',
  '            key: value',
  '        }',
  '    }',
  '  + group3: {',
  '        fee: 100500',
  '    }',
  '  - group2: {',
  '        abc: 12345',
  '    }',
  '}',
].join('\n');

const diffBtoA = [
  '{',
  '    host: hexlet.io',
  '  + timeout: 20',
  '  - timeout: 50',
  '  + verbose: true',
  '  - proxy: 123.234.53.22',
  '  - follow: false',
  '}',
].join('\n');

const diffAtoB = [
  '{',
  '  + timeout: 50',
  '  - timeout: 20',
  '    host: hexlet.io',
  '  + proxy: 123.234.53.22',
  '  + follow: false',
  '  - verbose: true',
  '}',
].join('\n');

describe('FORMAT TEXT', () => {
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
    expect(genDiff(nestedAfterJson, nestedBeforeJson)).toEqual(diffBigBtoA);
  });

  test('nested yaml', () => {
    expect(genDiff(nestedAfterYAML, nestedBeforeYAML)).toEqual(diffBigBtoA);
  });
  test('nested ini', () => {
    expect(genDiff(nestedAfterINI, nestedBeforeINI)).toEqual(diffBigBtoA);
  });
});

describe('FORMAT PLAIN', () => {
  test('plain', () => {
    expect(genDiff(plainBefore, plainAfter, 'plain')).toEqual(plainFormat);
  });
});

describe('FORMAT JSON', () => {
  test('json', () => {
    expect(genDiff(plainAfter, plainBefore, 'json')).toEqual(JSON.stringify(json));
  });
});
