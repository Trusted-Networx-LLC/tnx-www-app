#!/usr/bin/env node
const { run } = require('react-snap');
const url = require('url');
const { reactSnap, homepage, devDependencies, dependencies } = require('../package.json');

const chromiumPath = process.argv[2];
if (!chromiumPath) {
  console.error('[react-snap] A Chromium executable path is required.');
  process.exit(1);
}

const reactScriptsVersion = parseInt(
  (devDependencies && devDependencies['react-scripts']) ||
    (dependencies && dependencies['react-scripts']),
  10,
);

const fixWebpackChunksIssue =
  reactScriptsVersion === 1 ? 'CRA1' : reactScriptsVersion === 2 ? 'CRA2' : undefined;

run({
  publicPath: homepage ? url.parse(homepage).pathname : '/',
  fixWebpackChunksIssue,
  ...reactSnap,
  puppeteerExecutablePath: chromiumPath,
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
