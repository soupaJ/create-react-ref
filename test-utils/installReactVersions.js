'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');

module.exports = function(path) {
  return readdirSync(path).forEach(version => {
    const cwd = join(path, version);

    // try {
    //     fs.statSync(join(cwd, 'node_modules'));
    // } catch(ex) {
    console.info(`Installing React version ${version} ...`);
    const spawn = spawnSync('npm', ['install'], {
      cwd,
      stdio: 'inherit'
    });

    if (spawn.status > 0) {
      process.exit(spawn.status);
    }
    // }
  });
};
