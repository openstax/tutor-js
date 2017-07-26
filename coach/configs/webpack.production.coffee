webpack = require 'webpack'
webpackUMDExternal = require 'webpack-umd-external'

module.exports =
  entry:
    'concept-coach-styles': ['resources/styles/main.less']
    'concept-coach': ['full-build']
  output:
    filename: '[name].min.js'
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react/addons'
      _: 'underscore'
      BS: 'react-bootstrap'
    })
  ]
  externals: webpackUMDExternal(
    underscore: '_'
  )
