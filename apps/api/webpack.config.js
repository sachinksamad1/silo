const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

const config = {
  output: {
    path: join(__dirname, '../../dist/apps/api'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets", "./src/db/migrations"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    })
  ],
  resolve: {
    alias: {
      core: join(__dirname, '../../libs/core/src/index.ts'),
      sync: join(__dirname, '../../libs/sync/src/index.ts'),
      storage: join(__dirname, '../../libs/storage/src/index.ts'),
      'api-client': join(__dirname, '../../libs/api-client/src/index.ts'),
      crypto: join(__dirname, '../../libs/crypto/src/index.ts'),
      ui: join(__dirname, '../../libs/ui/src/index.ts'),
    },
  },
  externals: [],
};

console.log('WEBPACK CONFIG LOADED', JSON.stringify(config, (k, v) => typeof v === 'function' ? '[Function]' : v, 2));

module.exports = config;
