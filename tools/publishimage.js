#!/usr/bin/env node
/**
 * Node.js API Starter Kit (https://reactstarter.com/nodejs)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const cp = require('child_process');
const pkg = require('../package.json');
const filename = `${pkg.name}.${new Date().toISOString().replace(/:./g, '-')}.tar`;

console.log("LAUNCHING DOCKER CONTAINER TO BUILD");
cp.spawnSync('docker-compose',
  ['run', '--rm', '--no-deps', 'api', '/bin/sh', '-c', 'yarn install; yarn run build'],
  { stdio: 'inherit' });
console.log("PREPARING API SERVER IMAGE"); // using Dockerfile
cp.spawnSync('docker', ['build', '--no-cache', '--tag', pkg.name, '.'], { stdio: 'inherit' });
// const ssh = cp.spawn('ssh', ['-C', host, 'docker', 'load'], { stdio: ['pipe', 'inherit', 'inherit'] });
console.log("SAVING API SERVER IMAGE");
cp.spawnSync('docker', ['save', "-o", filename, pkg.name], { stdio: 'inherit' });
console.log(`${filename} created`);
/*
docker.on('exit', () => { ssh.stdin.end(); });
ssh.on('exit', () => {
  if (process.argv.includes('--no-up')) return;
  cp.spawnSync('ssh', ['-C', host, 'docker-compose', '-f', composeFile, 'up', '-d'], { stdio: 'inherit' });
  if (process.argv.includes('--no-prune')) return;
  cp.spawnSync('ssh', ['-C', host, 'docker', 'image', 'prune', '-a', '-f'], { stdio: 'inherit' });
});
*/
