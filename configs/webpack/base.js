import path from 'path';
import _ from 'lodash';
import webpack from 'webpack';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const LOADERS = {
  babel:  'babel-loader',
  coffee: 'coffee-loader',
  cjsx:   'coffee-jsx-loader',
  file:   'file-loader?name=[name].[ext]',
  url:    'url-loader?limit=30000&name=[name]-[hash].[ext]',
  style:  'style-loader',
  css:    'css-loader?minimize=true',
  less:   'less-loader',
  scss:   'fast-sass-loader',
};

const RESOLVABLES = {
  js:     { test: /\.js$/, use: LOADERS.babel, exclude: /node_modules/ },
  jsx:    { test: /\.jsx$/, use: LOADERS.babel, exclude: /node_modules/ },
  coffee: { test: /\.coffee$/, use: LOADERS.coffee, exclude: /node_modules/ },
  cjsx:   { test: /\.cjsx$/, use: LOADERS.cjsx, exclude: /node_modules/ },
};

const STATICS = {
  image: { test: /\.(png|jpg|svg|gif)/, use: [ LOADERS.file ] },
  font:  { test: /\.(woff|woff2|eot|ttf)/, use: [ LOADERS.url ] },
};

const BASE_BUILD = {
  js:     RESOLVABLES.js,
  jsx:    RESOLVABLES.jsx,
  coffee: RESOLVABLES.coffee,
  cjsx:   RESOLVABLES.cjsx,
  css:  { test: /\.css$/, use: LOADERS.css },
  less: { test: /\.less$/, use: [ LOADERS.style, LOADERS.css, LOADERS.less ] },
  scss: { test: /\.scss$/, use: [ LOADERS.style, LOADERS.css, LOADERS.scss ] },
};

const DEV_LOADERS = ['react-hot-loader/webpack'];

const BASE_DEV_LOADER_RULES = _.map(BASE_BUILD, function(loaderConfig, type) {
  const config = _.pick(loaderConfig, 'test', 'exclude');
  if (!config.use) { config.use = []; }
  config.use = loaderConfig.use;
  return config;
});

const BASE_BUILD_LOADERS = _.values(BASE_BUILD);

const RESOLVABLE_EXTENSIONS = _.union(_.chain(RESOLVABLES).keys().map(ext => `.${ext}`).value());

// base config, true for all builds no matter what conditions
const BASE_CONFIG = {
  cache: true,
  devtool: 'eval-source-map',
  resolve: {
    extensions: RESOLVABLE_EXTENSIONS,
  },
  output: {
    filename: '[name].js',
    // path: defined in project/environment specific
    // publicPath: defined in project/environment specific
    chunkFilename: '[name]-chunk-[hash].js',
  },
  module: {
    noParse: [
      /\/sinon\.js/,
    ],
    rules: _.values(STATICS),
  },
};


const mergeWebpackConfigs = function() {

  const mergeArrays = function(a, b) {
    if (_.isArray(a)) {
      return a.concat(b);
    }
  };

  const mergeArgs = _.chain(arguments).toArray().unshift({}).push(mergeArrays).value();
  return _.mergeWith.apply(null, mergeArgs);
};

// TODO handle if project doesn't exist
const loadProjectBaseConfig = function(projectName) {
  const projectBaseConfig = require(`../../${projectName}/configs/base`);

  return _.extend({ basePath: projectName }, projectBaseConfig);
};


const makeBuildOutputs = projectConfig =>
  ({
    path: `${projectConfig.basePath}/dist`,
    publicPath: '/assets/',
  })
;

// This used to return extractText plugin but that's no longer used
// Method is left in case there's more plugins that only are used in build later
const makeBuildPlugins = projectConfig => [];

const makePathsBase = function(projectConfig) {
  const { basePath } = projectConfig;

  const pathConfigs = {
    resolve: {
      modules: [
        'node_modules',
        path.resolve(basePath),
        path.resolve(basePath, 'src'),
        path.resolve(basePath, 'api'),
      ],
      alias: {
        'shared': path.resolve('shared', 'src'),
      },
    },
  };

  return pathConfigs;
};

const makeDebugBase = function(projectConfig) {
  // omits minification and using production build of react.
  let debugBase;
  return debugBase = {
    output: makeBuildOutputs(projectConfig),
    module: {
      rules: BASE_BUILD_LOADERS,
    },
    plugins: makeBuildPlugins(projectConfig),
  };
};

const makeProductionBase = function(projectConfig) {

  let productionBase;
  const output = makeBuildOutputs(projectConfig);

  // rename to minified
  output.filename = '[name].min.js';
  let { styleFilename } = projectConfig;
  if (styleFilename == null) { styleFilename = '[name].min.css'; }

  return productionBase = {
    output,
    devtool: 'source-map',
    module: {
      rules: BASE_BUILD_LOADERS,
    },
    plugins: makeBuildPlugins({ styleFilename }).concat([

      // Use the production version of React (no warnings/runtime checks)
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ]),
  };
};

const makeProductionWithCoverageBase = function(projectConfig) {
  const productionBase = makeProductionBase(projectConfig);
  const postLoaders = [
    { test: /\.coffee$/, loaders: ['istanbul-instrumenter'] },
    { test: /\.cjsx$/, loaders: ['istanbul-instrumenter'] },
  ];
  return mergeWebpackConfigs(productionBase, { postLoaders });
};

const makeDevelopmentBase = function(projectConfig) {
  const host = process.env.OX_PROJECT_HOST || projectConfig.host || 'localhost';
  const port = process.env.DEV_PORT || projectConfig.devPort;
  const servePath = `http://${host}:${port}`;
  const publicPath = `${servePath}/dist/`;
  const outputPath = `${projectConfig.basePath}/`;

  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin(),
  ];

  if (process.env.CACHE) { plugins.push(new HardSourceWebpackPlugin()); }

  const developmentBase = {
    context: path.resolve(__dirname, '../../', projectConfig.basePath),
    output: {
      path: '/',
      publicPath,
    },
    module: {
      rules: BASE_DEV_LOADER_RULES,
    },
    plugins,
    devServer: {
      contentBase: `${projectConfig.basePath}/`,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      publicPath,
      historyApiFallback: true,
      inline: true,
      port: projectConfig.devPort,
      // It suppress error shown in console, so it has to be set to false.
      quiet: false,
      // progress: true
      // It suppress everything except error, so it has to be set to false as well
      // to see success build.
      noInfo: false,
      host: '0.0.0.0',
      filename: '[name].js',
      hot: true,
      stats: 'errors-only',
    },
  };

  return developmentBase;
};

const makeEnvironmentBase = {
  debug: makeDebugBase,
  production: makeProductionBase,
  productionWithCoverage: makeProductionWithCoverageBase,
  development: makeDevelopmentBase,
};

const ENVIRONMENTS = _.keys(makeEnvironmentBase);

const getEnvironmentName = function(environmentName) {
  if (_.includes(ENVIRONMENTS, environmentName)) {
    return environmentName;
  } else {
    return 'development';
  }
};

const makeBaseForEnvironment = function(environmentName) {
  environmentName = getEnvironmentName(environmentName);
  return makeEnvironmentBase[environmentName];
};

const ENVIRONMENT_ALIASES =
  { productionWithCoverage: 'production' };

export default {
  mergeWebpackConfigs,
  BASE_CONFIG,
  loadProjectBaseConfig,
  makePathsBase,
  makeBaseForEnvironment,
  getEnvironmentName,
  ENVIRONMENT_ALIASES,
};
