const { join } = require('path');
const { readdirSync } = require('fs');
const reacts = {};

require('raf/polyfill');

const reactsPath = join(__dirname, '../reacts');
readdirSync(reactsPath).forEach(version => {
  const cwd = join(reactsPath, version);
  reacts[version] = {
    ...require(cwd),
    version
  };
});

module.exports = function withReact(fn) {
  Object.keys(reacts).forEach(version => {
    fn(reacts[version]);
  });
};
