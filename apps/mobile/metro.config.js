const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const aliases = {
  core: path.resolve(workspaceRoot, 'libs/core/src/index.ts'),
  storage: path.resolve(workspaceRoot, 'libs/storage/src/index.ts'),
  sync: path.resolve(workspaceRoot, 'libs/sync/src/index.ts'),
  'api-client': path.resolve(workspaceRoot, 'libs/api-client/src/index.ts'),
};

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const target = aliases[moduleName] ?? moduleName;
  return resolve(context, target, platform);
};

module.exports = config;
