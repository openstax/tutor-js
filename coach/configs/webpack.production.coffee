webpack = require 'webpack'
webpackUMDExternal = require 'webpack-umd-external'

module.exports =
  entry:
    main: ['resources/styles/main.less']
    'full-build': ['full-build']
  output:
    filename: '[name].min.js'
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react/addons'
      _: 'underscore'
      BS: 'react-bootstrap'
      $: 'jquery'
    })
  ]
  externals: webpackUMDExternal(
    underscore: '_'
    jquery: '$'
  )