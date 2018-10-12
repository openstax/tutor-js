const path               = require('path');
const webpack            = require('webpack');

const PORTS = {
  tutor:      '8000',
  shared:     '8000',
  exercises:  '8001',
};

const production   = process.env.NODE_ENV === 'production';
const project      = process.env.OX_PROJECT || 'tutor';
const port         = process.env.DEV_PORT || PORTS[project] || '8000';
const host         = process.env.OX_PROJECT_HOST || 'localhost';
const servePath    = `http://${host}:${port}`;
const publicPath   = process.env.PUBLIC_PATH || (production ? '/assets/' : `${servePath}/dist/`);
const defaultEntry = `./${project}/index.js`;

const ENTRIES = {
  tutor: {
    tutor: defaultEntry,
    lmspair: './tutor/lms-pair.js',
  },
  exercises: { exercises: defaultEntry },
  shared: { demo: './shared/demo.cjsx' },
};

const config = {
  mode: production ? 'production' : 'development',
  entry: ENTRIES[project],
  output: {
    filename: production ? '[name].min.js' : '[name].js',
    path: path.resolve(__dirname, project, 'dist'),
    chunkFilename: '[name]-chunk-[hash].js',
    publicPath,
  },
  devtool: production ? 'source-map' : 'inline-source-map',
  module: {
    rules: [
      { test: /\.jsx?$/,   exclude: /(node_modules|highlighter)/, loader: 'babel-loader'         },
      { test: /\.coffee$/, exclude: /node_modules/, loader: 'coffee-loader'        },
      { test: /\.cjsx$/,   exclude: /node_modules/, loader: 'coffee-jsx-loader'    },
      { test: /\.(png|jpg|svg|gif)/, loader: 'file-loader', options: {}            },
      { test: /\.scss$/, use: [ 'style-loader', 'css-loader', 'fast-sass-loader' ] },
      { test: /\.(woff|woff2|eot|ttf)/, loader: 'url-loader',
        options: { limit: 30000, name: '[name]-[hash].[ext]' } },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, project, 'src'),
    ],
    alias: {
      shared: path.resolve(__dirname, 'shared', 'src'),
    },
    extensions: ['.js', '.jsx', '.coffee', '.cjsx', '.json'],
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(production ? 'production' : 'development'),
      },
    }),
  ],
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000,
  },
  devServer: {
    contentBase: project,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    port,
    publicPath,
    historyApiFallback: true,
    inline: true,
    quiet: false,
    noInfo: false,
    host: '0.0.0.0',
    filename: '[name].js',
    hot: true,
    stats: 'errors-only',
  },
};

if (!production) {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
  );
}

module.exports = config;
