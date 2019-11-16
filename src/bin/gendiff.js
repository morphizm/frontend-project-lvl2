#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '..';

const program = new Command();

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<file1> <file2>')
  .action((file1, file2) => {
    console.log(genDiff(file1, file2, program.format));
    process.exit(0);
  });

program.parse(process.argv);

if (program.format) {
  console.log('json, plain');
}
/*
if (formatValue !== 'plain' && formatValue !== 'json') {
  console.error('no command given!');
  process.exit(1);
}
*/
