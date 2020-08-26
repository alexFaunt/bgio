// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//

const initialDatePrefix = new Date().toISOString().split('.')[0].replace(/[^0-9]+/g, '');

// eslint-disable-next-line no-process-env
const { version } = require('../../../package.json');

const [major, minor, patch] = version.split('.');
const newPatch = parseInt(patch, 10) + 1;
const newVersion = [major, minor, newPatch].join('.');

module.exports = [
  {
    type: 'input',
    name: 'filename',
    message: 'Migration name:',
    format: (input) => `${input.replace(/[- ]+/g, '_')}`,
    result: (input) => `${initialDatePrefix}_${input.replace(/[- ]+/g, '_')}.ts`,
  },
  {
    type: 'input',
    name: 'version',
    message: 'App version:',
    initial: newVersion,
  },
];
