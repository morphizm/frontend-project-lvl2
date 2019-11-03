import genDiff from '../src';

const afterJson = `${__dirname}/__fixtures__/after.json`;
const beforeJson = `${__dirname}/__fixtures__/before.json`;
const afterYaml = `${__dirname}/__fixtures__/after.yml`;
const beforeYaml = `${__dirname}/__fixtures__/before.yml`;
const afterIni = `${__dirname}/__fixtures__/after.ini`;
const beforeIni = `${__dirname}/__fixtures__/before.ini`;
const bigAfterJson = `${__dirname}/__fixtures__/bigAfter.json`;
const bigBeforeJson = `${__dirname}/__fixtures__/bigBefore.json`;
const bigAfterYAML = `${__dirname}/__fixtures__/BigAfterYAML.yml`;
const bigBeforeYAML = `${__dirname}/__fixtures__/BigBeforeYAML.yml`;
const bigBeforeINI = `${__dirname}/__fixtures__/BigBeforeIni.ini`;
const bigAfterINI = `${__dirname}/__fixtures__/BigAfterIni.ini`;

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

test.each([[afterJson, beforeJson],
  [afterIni, beforeIni],
  [afterYaml, beforeYaml]])(
  'JSON 0, INI 1, YAML 2 current %#',
  (a, b) => {
    expect(genDiff(a, b)).toEqual(diffBtoA);
    expect(genDiff(b, a)).toEqual(diffAtoB);
  },
);
// */
test('jsonFull', () => {
  expect(genDiff(bigAfterJson, bigBeforeJson)).toEqual(diffBigBtoA);
});

test('YAMLFull', () => {
  expect(genDiff(bigAfterYAML, bigBeforeYAML)).toEqual(diffBigBtoA);
});
test('iniFull', () => {
  expect(genDiff(bigAfterINI, bigBeforeINI)).toEqual(diffBigBtoA);
});
// */
